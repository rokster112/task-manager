using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaskManagerApi.Models;

namespace TaskManagerApi.Services;

public class UserDashboardService
{
  private readonly IMongoCollection<ProjectTask> _tasksCollection;
  private readonly IMongoCollection<Project> _projectsCollection;
  private readonly IMongoCollection<AuthUser> _userCollection;
  public UserDashboardService(IOptions<TaskManagerDatabaseSettings> dbSettings)
  {
    var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
    var mongoDatabase = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
    _tasksCollection = mongoDatabase.GetCollection<ProjectTask>(dbSettings.Value.TasksCollectionName);
    _projectsCollection = mongoDatabase.GetCollection<Project>(dbSettings.Value.ProjectsCollectionName);
    _userCollection = mongoDatabase.GetCollection<AuthUser>(dbSettings.Value.UsersCollectionName);
  }

  public async Task<List<ProjectTask>> GetUserTasksAsync(string authenticatedUser, string? query = null)
  {
    if (query == "overdue-user-tasks")
    {
      var overdueTasks = await _tasksCollection.Find(t => t.AssignedForIds.Contains(authenticatedUser) && t.DueBy < DateTime.UtcNow && t.CompletedAt == null).ToListAsync();
      return overdueTasks;
    }
    if (query == "upcoming-user-tasks")
    {
      var upcomingTasks = await _tasksCollection.Find(t => t.AssignedForIds.Contains(authenticatedUser) && t.DueBy > DateTime.UtcNow && t.CompletedAt == null).ToListAsync();
      return upcomingTasks;
    }

    if (query == "due-in-seven-days")
    {
      var dueTasks = await _tasksCollection.Find(t => t.AssignedForIds.Contains(authenticatedUser) && t.CompletedAt == null && t.DueBy >= DateTime.UtcNow && t.DueBy <= DateTime.UtcNow.AddDays(7)).ToListAsync();
      return dueTasks;
    }

    if (query == "tasks-due-today")
    {
      var dueTodayTasks = await _tasksCollection.Find(t => t.AssignedForIds.Contains(authenticatedUser) && t.DueBy.Value.Date == DateTime.UtcNow.Date && t.CompletedAt == null).ToListAsync();
      return dueTodayTasks;
    }
    var activeTasks = await _tasksCollection.Find(t => t.AssignedForIds.Contains(authenticatedUser) && t.Status == Status.InProgress).ToListAsync();
    return activeTasks;
  }

  public async Task<ActionResult<List<Project>>> GetUserProjectsAsync(string authenticatedUser, string? query = null)
  {
    if (query == "upcoming")
    {
      var upcoming = await _projectsCollection.Find(p => p.Users.Any(u => u == authenticatedUser) && p.Status != Status.Completed && p.StartDate > DateTime.UtcNow).ToListAsync();
      return upcoming;
    }
    if (query == "most-recent")
    {
      var mostRecent = await _projectsCollection.Find(p => p.Users.Any(u => u == authenticatedUser) && p.Status != Status.Completed).SortByDescending(p => p.CreatedAt).ToListAsync();
      return mostRecent;
    }
    if (query == "overdue")
    {
      var overdue = await _projectsCollection.Find(p => p.Users.Any(u => u == authenticatedUser) && p.Status != Status.Completed && p.EndDate < DateTime.UtcNow).ToListAsync();
      return overdue;
    }
    if (query == "due-in-seven-days")
    {
      var dueSoon = await _projectsCollection.Find(p => p.Users.Any(u => u == authenticatedUser) && p.Status != Status.Completed && p.EndDate >= DateTime.UtcNow && p.EndDate <= DateTime.UtcNow.AddDays(7)).ToListAsync();
      return dueSoon;
    }
    if (query == "due-today")
    {
      var dueToday = await _projectsCollection.Find(p => p.Users.Any(u => u == authenticatedUser) && p.Status != Status.Completed && p.EndDate.Value.Date == DateTime.UtcNow.Date).ToListAsync();
      return dueToday;
    }

    if (query == "high-priority")
    {
      var highPriority = await _projectsCollection.Find(p => p.Users.Any(u => u == authenticatedUser) && p.Status != Status.Completed && (int)p.Priority > 2).ToListAsync();
      return highPriority;
    }
    return await _projectsCollection.Find(p => p.Users.Any(u => u == authenticatedUser) && p.Status == Status.InProgress).ToListAsync();
  }

  public async Task<AuthUser> GetUserFullInfoAsync(string authenticatedUser)
  {
    var user = await _userCollection.Find(u => u.UserId == authenticatedUser).FirstOrDefaultAsync();
    if (user is null) throw new Exception("You are not permitted access");
    return user;
  }

  public async Task UpdateUserInfoAsync(string authenticatedUser, UpdateUserInfoDTO dto)
  {
    var user = await GetUserFullInfoAsync(authenticatedUser);
    bool isValid = BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.Password);
    if (!string.IsNullOrWhiteSpace(dto.OldPassword) && !isValid) throw new UnauthorizedAccessException("Old password is incorrect!");
    var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
    user.Email = string.IsNullOrWhiteSpace(dto.Email) ? user.Email : dto.Email;
    user.Password = string.IsNullOrWhiteSpace(dto.Password) ? user.Password : passwordHash;
    user.FullName = string.IsNullOrWhiteSpace(dto.FullName) ? user.FullName : dto.FullName;
    user.Position = string.IsNullOrWhiteSpace(dto.Position) ? user.Position : dto.Position;
    user.AvatarUrl = string.IsNullOrWhiteSpace(dto.AvatarUrl) ? user.AvatarUrl : dto.AvatarUrl;

    await _userCollection.ReplaceOneAsync(u => u.UserId == user.UserId, user);
  }

  public async Task<List<ProjectTask>> UserCalendarDatesAsync(string authenticatedUser)
  {
    var tasks = await _tasksCollection.Find(t => t.AssignedForIds.Contains(authenticatedUser)).ToListAsync();
    return tasks;
  }
}
