using TaskManagerApi.Models;
using TaskManagerApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace TaskManagerApi.Controller;

[Authorize]
[ApiController]
[Route("/api")]
public class UserDashboardController : ControllerBase
{
  private readonly UserDashboardService _userDashboardService;
  public UserDashboardController(UserDashboardService userDashboardService)
  {
    _userDashboardService = userDashboardService;
  }

  [HttpGet("tasks/{query}")]
  public async Task<ActionResult<List<ProjectTask>>> GetUserTasks(string query)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null)
    {
      return Unauthorized(new { message = "You are not logged in" });
    }
    var tasks = await _userDashboardService.GetUserTasksAsync(query, authenticatedUser);
    return tasks;
  }
  [HttpGet("projects/{query}")]
  public async Task<ActionResult<List<Project>>> GetUserProjects(string query)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null)
    {
      return Unauthorized(new { message = "You are not logged in" });
    }
    var projects = await _userDashboardService.GetUserProjectsAsync(query, authenticatedUser);
    return projects;
  }
  [HttpGet("user-info")]
  public async Task<ActionResult<AuthUser>> GetUserInfo()
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null)
    {
      return Unauthorized(new { message = "You are not logged in" });
    }
    var user = await _userDashboardService.GetUserFullInfoAsync(authenticatedUser);
    return user;
  }

  [HttpPatch("user-info/update")]
  public async Task<ActionResult> UpdateUserInfo(UpdateUserInfoDTO dto)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null)
    {
      return Unauthorized(new { message = "You are not logged in" });
    }
    await _userDashboardService.UpdateUserInfoAsync(authenticatedUser, dto);
    return Ok();
  }
}
