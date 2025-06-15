using TaskManagerApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using ZstdSharp;
using Microsoft.AspNetCore.Mvc;

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

  public async Task<List<Project>> GetProjectsAsync(string authenticatedUser)
  {
    var allProjects = await _projectsCollection.Find(_ => true).ToListAsync();

    var userProjects = allProjects
        .Where(p => p.Users.Any(u => u.UserId == authenticatedUser))
        .ToList();

    return userProjects;
  }

  public async Task<Project?> GetProjectsAsync(string id, string authenticatedUser) =>
    await _projectsCollection.Find(p => p.Id == id && p.Users.Any(u => u.UserId == authenticatedUser)).FirstOrDefaultAsync();
  public async Task UpdateProjectAsync(string id, CreateProjectDTO dto, string authenticatedUser)
  {
    var project = await _projectsCollection.Find(p => p.Id == id && p.HeadOfProject.UserId == authenticatedUser).FirstOrDefaultAsync();
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
    var user = new UserInfoDTO
    {
      UserId = foundUser.UserId,
      FullName = foundUser.FullName,
      Position = foundUser.Position,
      AvatarUrl = foundUser.AvatarUrl
    };
    if (string.IsNullOrWhiteSpace(dto.Title)) throw new Exception("Title input is empty");
    if (dto.StartDate == null) throw new Exception("Please select start date");
    if (dto.EndDate == null) throw new Exception("Please select end date");
    if (string.IsNullOrWhiteSpace(dto.Description)) throw new Exception("Description input is empty");

    var newProject = new Project
    {
      Title = dto.Title,
      StartDate = dto.StartDate,
      EndDate = dto.EndDate,
      Description = dto.Description,
      Priority = dto.Priority,
      ClientName = dto.ClientName,
      HeadOfProject = user,
      Users = new List<UserInfoDTO> { user }
    };
    await _projectsCollection.InsertOneAsync(newProject);
    return newProject;
  }

  public async Task DeleteProjectAsync(string id, string authenticatedUser) =>
    await _projectsCollection.DeleteOneAsync(p => p.Id == id && p.HeadOfProject.UserId == authenticatedUser);

  public async Task<List<UserInfoDTO>> GetMembersAsync(string id, string authenticatedUser)
  {
    var allUsers = await _usersCollection.Find(_ => true).ToListAsync();
    var project = await _projectsCollection.Find(p => p.Id == id).FirstOrDefaultAsync();
    var userIds = project.Users.Select(u => u.UserId);
    if (project.HeadOfProject.UserId != authenticatedUser) throw new Exception("You do not have a permission to view members");
    return allUsers.Where(a => !userIds.Contains(a.UserId)).Select(u =>
    {
      var user = new UserInfoDTO { UserId = u.UserId, FullName = u.FullName, Position = u.Position, AvatarUrl = u.AvatarUrl };
      return user;
    }).ToList();
  }

  public async Task AddMembersAsync(string id, List<UserInfoDTO> addUsers, string authenticatedUser)
  {
    var filter = Builders<Project>.Filter.Eq(p => p.Id, id) &
      Builders<Project>.Filter.Eq(p => p.HeadOfProject.UserId, authenticatedUser);

    var project = await _projectsCollection.Find(p => p.Id == id && p.HeadOfProject.UserId == authenticatedUser).FirstOrDefaultAsync();
    if (project is null) throw new Exception("Project was not found or you are not logged in when trying to add members to the project");

    var projectUsers = new List<UserInfoDTO>(project.Users);
    projectUsers.AddRange(addUsers);

    var update = Builders<Project>.Update.Set(p => p.Users, projectUsers);

    await _projectsCollection.UpdateOneAsync(filter, update);
  }
}
