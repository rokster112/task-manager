using TaskManagerApi.Models;
using TaskManagerApi.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authorization;
using System.Data;

namespace TaskManagerApi.Controller;

[Authorize]
[ApiController]
[Route("api/projects/{projectId:length(24)}/tasks")]
public class ProjectTasksController : ControllerBase
{
  private readonly ProjectTasksService _tasksService;

  public ProjectTasksController(ProjectTasksService tasksService) =>
  _tasksService = tasksService;

  [HttpGet]
  public async Task<ActionResult<List<ProjectTask>>> GetTasks(string projectId)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null)
    {
      return Unauthorized(new { message = "You are not logged in" });
    }
    try
    {
      return await _tasksService.GetTasksAsync(authenticatedUser, projectId);
    }
    catch (Exception ex)
    {
      return BadRequest(ex.Message);
    }
  }

  [HttpGet("{id:length(24)}")]
  public async Task<ActionResult<ProjectTask>> GetTask(string projectId, string id)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null)
    {
      return Unauthorized(new { message = "You are not logged in" });
    }
    try
    {
      var task = await _tasksService.GetTaskAsync(authenticatedUser, projectId, id);
      return Ok(task);
    }
    catch (Exception ex)
    {
      return BadRequest(ex.Message);
    }
  }

  [HttpPost]
  public async Task<IActionResult> PostTask(string projectId, CreateProjectTaskDTO dto)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null)
    {
      return Unauthorized(new { message = "You are not logged in" });
    }
    try
    {
      var newTask = await _tasksService.CreateTaskAsync(authenticatedUser, projectId, dto);
      return Ok(newTask);
    }
    catch (Exception ex)
    {
      return BadRequest(ex.Message);
    }
  }

  [HttpPatch("{id:length(24)}")]
  public async Task<ActionResult> UpdateTask(string projectId, string id, CreateProjectTaskDTO dto)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null)
    {
      return Unauthorized(new { message = "You are not logged in" });
    }
    try
    {
      await _tasksService.UpdateTaskAsync(authenticatedUser, projectId, id, dto);
      return Ok();
    }
    catch (Exception ex)
    {
      return BadRequest(ex.Message);
    }

  }

  [HttpGet("{id:length(24)}/members")]
  public async Task<ActionResult<List<UserInfoDTO>>> GetMembersWithTask(string projectId, string id)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null)
    {
      return Unauthorized(new { message = "You are not logged in" });
    }
    try
    {
      return await _tasksService.GetMembersAsync(authenticatedUser, projectId, id);
    }
    catch (Exception ex)
    {
      return BadRequest(ex.Message);
    }
  }

  [HttpGet("members")]
  public async Task<ActionResult<List<UserInfoDTO>>> GetMembers(string projectId)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null)
    {
      return Unauthorized(new { message = "You are not logged in" });
    }
    try
    {
      return await _tasksService.GetMembersAsync(authenticatedUser, projectId);
    }
    catch (Exception ex)
    {
      return BadRequest(ex.Message);
    }
  }

  [HttpDelete("{id:length(24)}")]
  public async Task<ActionResult> DeleteTask(string projectId, string id)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null)
    {
      return Unauthorized(new { message = "You are not logged in" });
    }
    try
    {
      await _tasksService.DeleteTaskAsync(authenticatedUser, projectId, id);
      return NoContent();
    }
    catch (Exception ex)
    {
      return BadRequest(ex.Message);
    }

  }
}
