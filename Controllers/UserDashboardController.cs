using TaskManagerApi.Models;
using TaskManagerApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace TaskManagerApi.Controller;

[Authorize]
[ApiController]
[Route("api/home")]
public class UserDashboardController : ControllerBase
{
  private readonly UserDashboardService _userDashboardService;
  public UserDashboardController(UserDashboardService userDashboardService)
  {
    _userDashboardService = userDashboardService;
  }

  [HttpGet("tasks/{query?}")]
  public async Task<ActionResult<List<ProjectTask>>> GetUserTasks(string? query = null)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null)
    {
      return Unauthorized(new { message = "You are not logged in" });
    }
    var tasks = await _userDashboardService.GetUserTasksAsync(authenticatedUser, query);
    return tasks;
  }
  [HttpGet("projects/{query?}")]
  public async Task<ActionResult<List<Project>>> GetUserProjects(string? query = null)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null)
    {
      return Unauthorized(new { message = "You are not logged in" });
    }
    var projects = await _userDashboardService.GetUserProjectsAsync(authenticatedUser, query);
    return projects;
  }
  [HttpGet("user-info")]
  public async Task<ActionResult<AuthUser>> GetUserInfo()
  {
    try
    {
      var authenticatedUser = User.FindFirst("UserId")?.Value;
      if (authenticatedUser is null)
      {
        return Unauthorized(new { message = "You are not logged in" });
      }
      var user = await _userDashboardService.GetUserFullInfoAsync(authenticatedUser);
      return user;

    }
    catch (Exception ex)
    {
      return BadRequest(new { error = ex.Message });
    }
  }

  [HttpPatch("user-info/update")]
  public async Task<ActionResult> UpdateUserInfo(UpdateUserInfoDTO dto)
  {
    try
    {
      var authenticatedUser = User.FindFirst("UserId")?.Value;
      if (authenticatedUser is null)
      {
        return Unauthorized(new { message = "You are not logged in" });
      }
      await _userDashboardService.UpdateUserInfoAsync(authenticatedUser, dto);
      return Ok();
    }
    catch (Exception ex)
    {
      return BadRequest(new { error = ex.Message });
    }
  }
  [HttpGet("calendar-dates")]
  public async Task<ActionResult<List<ProjectTask>>> GetCalendarDates()
  {
    try
    {
      var authenticatedUser = User.FindFirst("UserId")?.Value;
      if (authenticatedUser is null)
      {
        return Unauthorized(new { message = "You are not logged in" });
      }
      var tasks = await _userDashboardService.UserCalendarDatesAsync(authenticatedUser);
      return tasks;
    }
    catch (Exception ex)
    {
      return BadRequest(new { error = ex.Message });
    }
  }
}
