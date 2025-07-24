using TaskManagerApi.Models;
using TaskManagerApi.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authorization;
using System.Data;

namespace TaskManagerApi.Controllers;

[Authorize]
[Route("api/tasks/{taskId:length(24)}/comments")]

public class CommentsController : ControllerBase
{
  private readonly CommentsService _commentsService;
  public CommentsController(CommentsService commentsService) =>
    _commentsService = commentsService;

  [HttpGet]
  public async Task<List<Comment>> GetComments(string taskId)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null) throw new UnauthorizedAccessException("You are not logged in");
    return await _commentsService.GetCommentsAsync(taskId, authenticatedUser);
  }

  [HttpPost]
  public async Task<Comment> PostComment(string taskId, [FromForm] CreateCommentDTO dto)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null) throw new UnauthorizedAccessException("You are not logged in");
    return await _commentsService.PostCommentAsync(taskId, authenticatedUser, dto);
  }

  [HttpDelete("{commentId:length(24)}")]
  public async Task DeleteComment(string commentId)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null) throw new UnauthorizedAccessException("You are not logged in");
    await _commentsService.DeleteCommentAsync(commentId, authenticatedUser);
  }

  [HttpPatch("{commentId:length(24)}")]
  public async Task UpdateComment(string commentId, [FromBody] CreateCommentDTO dto)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null) throw new UnauthorizedAccessException("You are not logged in");

    await _commentsService.UpdateCommentAsync(commentId, authenticatedUser, dto);
  }
}
