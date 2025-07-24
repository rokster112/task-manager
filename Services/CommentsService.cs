using MongoDB.Driver;
using TaskManagerApi.Models;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
namespace TaskManagerApi.Services;

public class CommentsService
{
  private readonly IMongoCollection<ProjectTask> _taskCollection;
  private readonly IMongoCollection<AuthUser> _userCollection;
  private readonly IMongoCollection<Comment> _commentCollection;
  private readonly IMongoCollection<Project> _projectCollection;
  private readonly CloudinaryService _cloudinaryService;

  public CommentsService(IOptions<TaskManagerDatabaseSettings> dbSettings, CloudinaryService cloudinaryService)
  {
    var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
    var mongoDatabase = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
    _commentCollection = mongoDatabase.GetCollection<Comment>(dbSettings.Value.CommentsCollectionName);
    _userCollection = mongoDatabase.GetCollection<AuthUser>(dbSettings.Value.UsersCollectionName);
    _taskCollection = mongoDatabase.GetCollection<ProjectTask>(dbSettings.Value.TasksCollectionName);
    _projectCollection = mongoDatabase.GetCollection<Project>(dbSettings.Value.ProjectsCollectionName);

    _cloudinaryService = cloudinaryService;
  }

  public async Task<List<Comment>> GetCommentsAsync(string taskId, string authenticatedUser)
  {
    var task = await _taskCollection.Find(t => t.TaskId == taskId).FirstOrDefaultAsync();
    if (task is null) throw new KeyNotFoundException($"Task with ID '{taskId}' was not found.");
    var project = await _projectCollection.Find(p => p.Id == task.ProjectId).FirstOrDefaultAsync();
    if (project is null) throw new KeyNotFoundException("Associated project not found.");
    var comments = await _commentCollection.Find(c => c.TaskId == taskId).ToListAsync();
    if (!task.AssignedForIds.Contains(authenticatedUser) && project.HeadOfProject != authenticatedUser) throw new UnauthorizedAccessException("You are not authorized to view these comments.");
    return comments;
  }

  public async Task<Comment> PostCommentAsync(string taskId, string authenticatedUser, CreateCommentDTO dto)
  {
    var task = await _taskCollection.Find(t => t.TaskId == taskId).FirstOrDefaultAsync();
    if (task is null) throw new KeyNotFoundException($"Task with ID '{taskId}' was not found.");
    var project = await _projectCollection.Find(p => p.Id == task.ProjectId).FirstOrDefaultAsync();
    if (!task.AssignedForIds.Contains(authenticatedUser) && project.HeadOfProject != authenticatedUser) throw new UnauthorizedAccessException("You are not authorized to post a comment");
    if (string.IsNullOrWhiteSpace(dto.Body)) throw new ArgumentException("Comment body cannot be empty.");
    var image = await _cloudinaryService.UploadImageAsync(dto.Image);

    var comment = new Comment
    {
      TaskId = taskId,
      CommentBy = authenticatedUser,
      Body = dto.Body,
      ImageUrl = image?.SecureUrl?.ToString() ,
      ImageId = image?.PublicId
    };

    await _commentCollection.InsertOneAsync(comment);
    return comment;
  }

  public async Task DeleteCommentAsync(string commentId, string authenticatedUser)
  {
    var comment = await _commentCollection.Find(c => c.CommentBy == authenticatedUser && c.CommentId == commentId).FirstOrDefaultAsync();
    if (comment is null) throw new Exception("Comment not found, or you do not have permission.");
    if (comment.ImageId != null) await _cloudinaryService.DeleteImageAsync(comment.ImageId);
    await _commentCollection.DeleteOneAsync(c => c.CommentId == commentId);
  }

  public async Task UpdateCommentAsync(string commentId, string authenticatedUser, CreateCommentDTO dto)
  {
    var comment = await _commentCollection.Find(c => c.CommentId == commentId && c.CommentBy == authenticatedUser).FirstOrDefaultAsync();
    if (comment is null) throw new Exception("Comment not found, or you do not have permission.");
    if (string.IsNullOrWhiteSpace(dto.Body)) throw new ArgumentException("Comment body cannot be empty.");

    comment.Body = dto.Body;

    await _commentCollection.ReplaceOneAsync(c => c.CommentId == commentId, comment);
  }
}
