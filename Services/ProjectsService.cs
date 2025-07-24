using TaskManagerApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ZstdSharp;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.IdentityModel.Tokens;

namespace TaskManagerApi.Services;

public class ProjectsService
{
  private readonly IMongoCollection<Project> _projectsCollection;
  private readonly IMongoCollection<AuthUser> _usersCollection;

  public ProjectsService(IOptions<TaskManagerDatabaseSettings> dbSettings)
  {
    var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
    var mongoDatabase = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
    _projectsCollection = mongoDatabase.GetCollection<Project>(dbSettings.Value.ProjectsCollectionName);
    _usersCollection = mongoDatabase.GetCollection<AuthUser>(dbSettings.Value.UsersCollectionName);
  }

  public async Task<List<Project>> GetProjectsAsync(string authenticatedUser, string? query = null)
  {
    var allProjects = await _projectsCollection.Find(p => p.Users.Any(u => u == authenticatedUser)).ToListAsync();
    var activeProjects = allProjects.Where(p => p.Status != Status.Completed).ToList();
    if (query == "end-date-asc")
    {
      return activeProjects.OrderBy(p => p.EndDate).ToList();
    }
    if (query == "end-date-desc")
    {
      return activeProjects.OrderByDescending(p => p.EndDate).ToList();
    }
    if (query == "due-in-seven-days")
    {
      return activeProjects.Where(p => p.EndDate >= DateTime.UtcNow && p.EndDate <= DateTime.UtcNow.AddDays(7)).ToList();
    }
    if (query == "due-today")
    {
      return activeProjects.Where(p => p.EndDate.Value.Date == DateTime.UtcNow.Date).ToList();
    }
    if (query == "high-priority")
    {
      return activeProjects.Where(p => (int)p.Priority > 2).ToList();
    }
    if (query == "in-progress")
    {
      return activeProjects.Where(p => p.Status == Status.InProgress).ToList();
    }
    if (query == "created-date-asc")
    {
      return allProjects.OrderBy(p => p.CreatedAt).ToList();
    }
    if (query == "created-date-desc")
    {
      return allProjects.OrderByDescending(p => p.CreatedAt).ToList();
    }
    if (query == "my-led-projects")
    {
      return allProjects.Where(p => p.HeadOfProject == authenticatedUser).ToList();
    }

    return allProjects;
  }

  public async Task<Project?> GetProjectAsync(string id, string authenticatedUser) =>
    await _projectsCollection.Find(p => p.Id == id && p.Users.Any(u => u == authenticatedUser)).FirstOrDefaultAsync();
  public async Task UpdateProjectAsync(string id, CreateProjectDTO dto, string authenticatedUser)
  {
    var project = await _projectsCollection.Find(p => p.Id == id && p.HeadOfProject == authenticatedUser).FirstOrDefaultAsync();
    project.Title = !string.IsNullOrWhiteSpace(dto.Title) ? dto.Title : project.Title;
    project.StartDate = dto.StartDate != null ? dto.StartDate : project.StartDate;
    project.EndDate = dto.EndDate != null ? dto.EndDate : project.EndDate;
    project.Description = !string.IsNullOrWhiteSpace(dto.Description) ? dto.Description : project.Description;
    project.Priority = dto.Priority != project.Priority ? dto.Priority : project.Priority;
    project.ClientName = !string.IsNullOrWhiteSpace(dto.ClientName) ? dto.ClientName : project.ClientName;
    project.Status = project.Status != dto.Status ? dto.Status : project.Status;

    await _projectsCollection.ReplaceOneAsync(p => p.Id == id, project);
  }
  public async Task<Project> CreateProjectAsync(CreateProjectDTO dto, string authenticatedUser)
  {
    var foundUser = await _usersCollection.Find(u => u.UserId == authenticatedUser).FirstOrDefaultAsync();
    if (string.IsNullOrWhiteSpace(dto.Title)) throw new Exception("Title input is empty");
    if (dto.StartDate == null) throw new Exception("Please select start date");
    if (dto.EndDate == null) throw new Exception("Please select end date");
    if (string.IsNullOrWhiteSpace(dto.Description)) throw new Exception("Description input is empty");
    if (dto.StartDate > dto.EndDate) throw new Exception("Start Date cannot be ahead of End Date");
    if (!Enum.IsDefined(typeof(Priority), dto.Priority)) throw new Exception("Invalid priority selected.");

    var newProject = new Project
    {
      Title = dto.Title,
      StartDate = dto.StartDate ?? DateTime.UtcNow,
      EndDate = dto.EndDate ?? DateTime.UtcNow,
      Description = dto.Description,
      Priority = dto.Priority,
      ClientName = dto.ClientName,
      HeadOfProject = foundUser.UserId,
      Users = new List<string> { foundUser.UserId }
    };
    await _projectsCollection.InsertOneAsync(newProject);
    return newProject;
  }

  public async Task DeleteProjectAsync(string id, string authenticatedUser) =>
    await _projectsCollection.DeleteOneAsync(p => p.Id == id && p.HeadOfProject == authenticatedUser);

  public async Task<List<UserInfoDTO>> GetMembersAsync(string id, string authenticatedUser)
  {
    var allUsers = await _usersCollection.Find(_ => true).ToListAsync();
    var project = await _projectsCollection.Find(p => p.Id == id).FirstOrDefaultAsync();
    if (!project.Users.Contains(authenticatedUser)) throw new Exception("You do not have a permission to view members");
    return allUsers.Where(a => !project.Users.Contains(a.UserId)).Select(u =>
    {
      var user = new UserInfoDTO { UserId = u.UserId, FullName = u.FullName, Position = u.Position, AvatarUrl = u.AvatarUrl };
      return user;
    }).ToList();
  }

  public async Task<UserInfoDTO> GetHeadAsync(string id, string authenticatedUser)
  {
  var project = await _projectsCollection.Find(p => p.Id == id && p.Users.Contains(authenticatedUser)).FirstOrDefaultAsync();
    if (project is null)
        throw new Exception("You do not have permission to view this data");

    var user = await _usersCollection.Find(u => u.UserId == project.HeadOfProject).FirstOrDefaultAsync();
    if (user is null)
        throw new Exception("User not found");

    return new UserInfoDTO
    {
        UserId = user.UserId,
        FullName = user.FullName,
        Position = user.Position,
        AvatarUrl = user.AvatarUrl
    };
  }

  public async Task<List<UserInfoDTO>> GetProjectMembersAsync(string id, string authenticatedUser)
  {
    var project = await _projectsCollection.Find(p => p.Id == id && p.Users.Contains(authenticatedUser)).FirstOrDefaultAsync();
    if (project is null)
      throw new Exception("You do not have permission to view this data");
    var users = await _usersCollection.Find(u => project.Users.Contains(u.UserId)).ToListAsync();
    return users.Select(u => new UserInfoDTO { UserId = u.UserId, FullName = u.FullName, Position = u.Position, AvatarUrl = u.AvatarUrl }).ToList();
  }

  public async Task AddMembersAsync(string id, List<string> addUsers, string authenticatedUser)
  {
    var filter = Builders<Project>.Filter.Eq(p => p.Id, id) &
      Builders<Project>.Filter.Eq(p => p.HeadOfProject, authenticatedUser);

    var project = await _projectsCollection.Find(p => p.Id == id && p.HeadOfProject == authenticatedUser).FirstOrDefaultAsync();
    if (project is null) throw new Exception("Project was not found or you are not logged in when trying to add members to the project");

    var projectUsers = new List<string>(project.Users);
    projectUsers.AddRange(addUsers);

    var update = Builders<Project>.Update.Set(p => p.Users, projectUsers);

    await _projectsCollection.UpdateOneAsync(filter, update);
  }

public async Task UpdateProjectStatusAndPriorityAsync(string id, string authenticatedUser, UpdateProjectStatusPriorityDTO dto)
{
    var filter = Builders<Project>.Filter.Eq(p => p.Id, id) &
      Builders<Project>.Filter.Eq(p => p.HeadOfProject, authenticatedUser);

    var project = await _projectsCollection.Find(p => p.Id == id).FirstOrDefaultAsync();
    if (project is null)
        throw new Exception("Project was not found or you're unauthorized.");

    var updateDef = Builders<Project>.Update;
    UpdateDefinition<Project> update = null;

    if (dto.Status.HasValue)
        update = update == null ? updateDef.Set(p => p.Status, dto.Status.Value) : update.Set(p => p.Status, dto.Status.Value);

    if (dto.Priority.HasValue)
        update = update == null ? updateDef.Set(p => p.Priority, dto.Priority.Value) : update.Set(p => p.Priority, dto.Priority.Value);

    if (update != null)
        await _projectsCollection.UpdateOneAsync(filter, update);
}
}
