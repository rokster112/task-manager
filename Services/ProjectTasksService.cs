using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaskManagerApi.Models;

namespace TaskManagerApi.Services;

public class ProjectTasksService
{
  private readonly IMongoCollection<ProjectTask> _tasksCollection;
  private readonly IMongoCollection<AuthUser> _usersCollection;
  private readonly IMongoCollection<Project> _projectsCollection;

  public ProjectTasksService(IOptions<TaskManagerDatabaseSettings> dbSettings)
  {
    var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
    var mongoDatabase = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
    _tasksCollection = mongoDatabase.GetCollection<ProjectTask>(dbSettings.Value.TasksCollectionName);
    _usersCollection = mongoDatabase.GetCollection<AuthUser>(dbSettings.Value.UsersCollectionName);
    _projectsCollection = mongoDatabase.GetCollection<Project>(dbSettings.Value.ProjectsCollectionName);
  }

  public async Task<List<ProjectTask>> GetTasksAsync(string authenticatedUser, string projectId)
  {
    var project = await _projectsCollection.Find(p => p.Id == projectId && p.Users.Any(u => u.UserId == authenticatedUser)).FirstOrDefaultAsync();
    if (project is null) throw new Exception("You are not permitted access");
    var tasks = await _tasksCollection.Find(t => t.ProjectId == projectId).ToListAsync();
    if (tasks is null) throw new Exception("Not Found");
    return tasks;
  }

  public async Task<ProjectTask?> GetTaskAsync(string authenticatedUser, string projectId, string id)
  {
    var project = await _projectsCollection.Find(p => p.Id == projectId && p.Users.Any(u => u.UserId == authenticatedUser)).FirstOrDefaultAsync();
    if (project is null) throw new Exception("You are not permitted access");
    var task = await _tasksCollection.Find(t => t.ProjectId == projectId && t.TaskId == id).FirstOrDefaultAsync();
    if (task is null) throw new Exception("Not Found");
    return task;
  }

  public async Task<ProjectTask> CreateTaskAsync(string authenticatedUser, string projectId, CreateProjectTaskDTO dto)
  {
    var project = await _projectsCollection.Find(p => p.Id == projectId && p.HeadOfProject.UserId == authenticatedUser).FirstOrDefaultAsync();
    if (project is null) throw new Exception("You are not authoried to create a task");
    if (string.IsNullOrWhiteSpace(dto.Title)) throw new Exception("Title input is empty");
    if (string.IsNullOrWhiteSpace(dto.Description)) throw new Exception("Description input is empty");
    if (dto.AssignedForIds.Count == 0) throw new Exception("You have not assigned any members");
    if (dto.DueBy is null) throw new Exception("You must include Due By date");
    if (!Enum.IsDefined(typeof(Priority), dto.Priority)) throw new Exception("Invalid priority selected");
    if (dto.DueBy is null || dto.DueBy < DateTime.UtcNow) throw new Exception("Your Due By date is invalid");

    var newTask = new ProjectTask
    {
      Title = dto.Title,
      AssignedForIds = dto.AssignedForIds,
      Description = dto.Description,
      DueBy = dto.DueBy,
      Priority = dto.Priority,
      Status = dto.Status,
      ProjectId = projectId,
    };

    await _tasksCollection.InsertOneAsync(newTask);
    return newTask;
  }

  public async Task UpdateTaskAsync(string authenticatedUser, string projectId, string id, CreateProjectTaskDTO dto)
  {
    var project = await _projectsCollection.Find(p => p.Id == projectId && p.Users.Any(u => u.UserId == authenticatedUser)).FirstOrDefaultAsync();
    var task = await _tasksCollection.Find(t => t.TaskId == id).FirstOrDefaultAsync();
    if (project is null) throw new Exception("Access denied, you are not part of the project");
    if (task is null) throw new Exception("Task Not Found");
    if (!task.AssignedForIds.Any(a => a == authenticatedUser) && project.HeadOfProject.UserId != authenticatedUser) throw new Exception("You cannot modify the task");

    task.Title = !string.IsNullOrWhiteSpace(dto.Title) ? dto.Title : task.Title;
    task.Description = !string.IsNullOrWhiteSpace(dto.Description) ? dto.Description : task.Description;

    if (dto.DueBy != null && dto.DueBy >= DateTime.UtcNow)
      task.DueBy = dto.DueBy.Value;

    if (Enum.IsDefined(typeof(Priority), dto.Priority) && dto.Priority != task.Priority)
      task.Priority = dto.Priority;

    if (Enum.IsDefined(typeof(Status), dto.Status) && dto.Status != task.Status)
      task.Status = dto.Status;

    if (dto.AssignedForIds != null && dto.AssignedForIds.Count > 0)
    {
      task.AssignedForIds = task.AssignedForIds
          .Union(dto.AssignedForIds)
          .ToList();
    }
    if (dto.Status == Status.Completed)
    {
      task.CompletedAt = DateTime.UtcNow;
    }
    else
    {
      task.CompletedAt = null;
    }

    await _tasksCollection.ReplaceOneAsync(t => t.TaskId == id, task);
  }

  public async Task DeleteTaskAsync(string authenticatedUser, string projectId, string id)
  {
    var project = await _projectsCollection.Find(p => p.Id == projectId && p.HeadOfProject.UserId == authenticatedUser).FirstOrDefaultAsync();
    if (project is null) throw new Exception("You cannot delete this task");
    var task = await _tasksCollection.Find(t => t.TaskId == id && t.ProjectId == projectId).FirstOrDefaultAsync();
    if (task is null) throw new Exception("Task not found");
    await _tasksCollection.DeleteOneAsync(t => t.TaskId == id && t.ProjectId == projectId);
  }

  public async Task<List<UserInfoDTO>> GetMembersAsync(string authenticatedUser, string projectId, string id)
  {
    var project = await _projectsCollection.Find(p => p.Id == projectId && p.HeadOfProject.UserId == authenticatedUser).FirstOrDefaultAsync();
    if (project is null) throw new Exception("You are not authorized");
    var task = await _tasksCollection.Find(t => t.TaskId == id).FirstOrDefaultAsync();
    if (task is null) throw new Exception("Task not found");

    var userIds = project.Users
        .Where(p => !task.AssignedForIds.Contains(p.UserId))
        .Select(p => p.UserId)
        .ToList();


    var allUsers = await _usersCollection.Find(u => userIds.Contains(u.UserId)).ToListAsync();
    return allUsers.Select(u => new UserInfoDTO { UserId = u.UserId, FullName = u.FullName, Position = u.Position, AvatarUrl = u.AvatarUrl }).ToList();

  }
}
