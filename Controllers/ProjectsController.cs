using TaskManagerApi.Models;
using TaskManagerApi.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authorization;
using System.Data;

namespace TaskManagerApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
  private readonly ProjectsService _projectsService;

  public ProjectsController(ProjectsService projectsService) =>
    _projectsService = projectsService;

  [HttpGet("{query}")]
  public async Task<List<Project>> GetProjects(string query)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null) throw new Exception("You are not logged in");
    return await _projectsService.GetProjectsAsync(query, authenticatedUser);
  }

  [HttpGet("{id:length(24)}")]
  public async Task<ActionResult<Project>> GetProject(string id)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null) throw new Exception("You are not logged in");
    var project = await _projectsService.GetProjectAsync(id, authenticatedUser);
    if (project is null) return NotFound();
    return project;
  }

  [HttpPost]
  public async Task<IActionResult> PostProject(CreateProjectDTO dto)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null) throw new Exception("You are not logged in");
    try
    {
      var newProject = await _projectsService.CreateProjectAsync(dto, authenticatedUser);
      return CreatedAtAction(nameof(GetProject), new { id = newProject.Id }, newProject);
    }
    catch (Exception ex)
    {
      return BadRequest(ex.Message);
    }
  }

  [HttpPatch("{id:length(24)}")]
  public async Task<IActionResult> UpdateProject(string id, CreateProjectDTO dto)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null) throw new Exception("You are not logged in");
    await _projectsService.UpdateProjectAsync(id, dto, authenticatedUser);
    return Ok();
  }

  [HttpDelete("{id:length(24)}")]
  public async Task<IActionResult> DeleteProject(string id)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null) throw new Exception("You are not logged in");
    await _projectsService.DeleteProjectAsync(id, authenticatedUser);
    return NoContent();
  }

  [HttpPatch("{id:length(24)}/members")]
  public async Task<ActionResult> AddUsers(string id, List<UserInfoDTO> addUsers)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null) throw new Exception("You are not logged in");
    await _projectsService.AddMembersAsync(id, addUsers, authenticatedUser);
    return Ok();
  }

  [HttpGet("{id:length(24)}/members")]
  public async Task<List<UserInfoDTO>> GetUsers(string id)
  {
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null) throw new Exception("You are not logged in");
    return await _projectsService.GetMembersAsync(id, authenticatedUser);
  }

[HttpPatch("{id:length(24)}/status-priority")]
public async Task<ActionResult> UpdateStatusAndPriority(string id, UpdateProjectStatusPriorityDTO dto)
{
    var authenticatedUser = User.FindFirst("UserId")?.Value;
    if (authenticatedUser is null) throw new Exception("You are not logged in");
    await _projectsService.UpdateProjectStatusAndPriorityAsync(id, authenticatedUser, dto);
    return Ok();
}

}
