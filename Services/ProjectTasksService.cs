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
    var project = await _projectsCollection.Find(p => p.Id == projectId && p.Users.Any(u => u == authenticatedUser)).FirstOrDefaultAsync();
    if (project is null) throw new Exception("You are not permitted access");
    var tasks = await _tasksCollection.Find(t => t.ProjectId == projectId).ToListAsync();
    if (tasks is null) throw new Exception("Not Found");
    return tasks;
  }

  public async Task<ProjectTask?> GetTaskAsync(string authenticatedUser, string projectId, string id)
  {
    var project = await _projectsCollection.Find(p => p.Id == projectId && p.Users.Any(u => u == authenticatedUser)).FirstOrDefaultAsync();
    if (project is null) throw new Exception("You are not permitted access");
    var task = await _tasksCollection.Find(t => t.ProjectId == projectId && t.TaskId == id).FirstOrDefaultAsync();
    if (task is null) throw new Exception("Not Found");
    return task;
  }

  public async Task<ProjectTask> CreateTaskAsync(string authenticatedUser, string projectId, CreateProjectTaskDTO dto)
  {
    var project = await _projectsCollection.Find(p => p.Id == projectId && p.HeadOfProject == authenticatedUser).FirstOrDefaultAsync();
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
      DueBy = dto.DueBy is DateTime dueBy
          ? DateTime.SpecifyKind(dueBy, DateTimeKind.Utc)
          : DateTime.UtcNow,
      Priority = dto.Priority,
      Status = !Enum.IsDefined(typeof(Status), dto.Status) ? Status.Created : dto.Status,
      ProjectId = projectId,
      CompletedAt = dto.Status == Status.Completed ? DateTime.UtcNow : null
    };

    await _tasksCollection.InsertOneAsync(newTask);
    return newTask;
  }

  public async Task UpdateTaskAsync(string authenticatedUser, string projectId, string id, CreateProjectTaskDTO dto)
  {
    var project = await _projectsCollection.Find(p => p.Id == projectId && p.Users.Any(u => u == authenticatedUser)).FirstOrDefaultAsync();
    var task = await _tasksCollection.Find(t => t.TaskId == id).FirstOrDefaultAsync();
    if (project is null) throw new Exception("Access denied, you are not part of the project");
    if (task is null) throw new Exception("Task Not Found");
    if (!task.AssignedForIds.Any(a => a == authenticatedUser) && project.HeadOfProject != authenticatedUser) throw new Exception("You cannot modify the task");

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
      task.AssignedForIds = dto.AssignedForIds;
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
    var project = await _projectsCollection.Find(p => p.Id == projectId && p.HeadOfProject == authenticatedUser).FirstOrDefaultAsync();
    if (project is null) throw new Exception("You cannot delete this task");
    var task = await _tasksCollection.Find(t => t.TaskId == id && t.ProjectId == projectId).FirstOrDefaultAsync();
    if (task is null) throw new Exception("Task not found");
    await _tasksCollection.DeleteOneAsync(t => t.TaskId == id && t.ProjectId == projectId);
  }

//Route without task id
  public async Task<List<UserInfoDTO>> GetMembersAsync(string authenticatedUser, string projectId)
  {
    var project = await _projectsCollection
        .Find(p => p.Id == projectId && p.HeadOfProject == authenticatedUser)
        .FirstOrDefaultAsync();

    if (project is null) throw new Exception("You are not authorized");

    var userIds = project.Users.Select(u => u).ToList();

    var allUsers = await _usersCollection.Find(u => userIds.Contains(u.UserId)).ToListAsync();
    return allUsers
        .Select(u => new UserInfoDTO { UserId = u.UserId, FullName = u.FullName, Position = u.Position, AvatarUrl = u.AvatarUrl })
        .ToList();
  }

//Route with task id
public async Task<List<UserInfoDTO>> GetMembersAsync(string authenticatedUser, string projectId, string id)
{
    var project = await _projectsCollection
        .Find(p => p.Id == projectId && p.HeadOfProject == authenticatedUser)
        .FirstOrDefaultAsync();

    if (project is null) throw new Exception("You are not authorized");

    var task = await _tasksCollection.Find(t => t.TaskId == id).FirstOrDefaultAsync();
    if (task is null) throw new Exception("Task not found");

    var userIds = task.AssignedForIds
        .Select(p => p)
        .ToList();

    var allUsers = await _usersCollection.Find(u => userIds.Contains(u.UserId)).ToListAsync();
    return allUsers
        .Select(u => new UserInfoDTO { UserId = u.UserId, FullName = u.FullName, Position = u.Position, AvatarUrl = u.AvatarUrl })
        .ToList();
}

}
