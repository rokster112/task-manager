using Microsoft.AspNetCore.Mvc;
using TaskManagerApi.Models;
using TaskManagerApi.Services;

namespace TaskManagerApi.Controllers;

[ApiController]
[Route("api/auth/")]
public class AuthUserController : ControllerBase
{
  private readonly UsersService _usersService;
  public AuthUserController(UsersService usersService) =>
    _usersService = usersService;

  [HttpPost("register")]
  public async Task<IActionResult> Register([FromBody]RegisterUserDTO dto)
  {
    try
    {
      var user = await _usersService.RegisterUser(dto);
      return Ok(user);
    }
    catch (Exception ex)
    {
      return BadRequest(ex.Message);
    }
  }

  [HttpPost("login")]
  public async Task<IActionResult> LoginUser([FromBody]LoginUserDTO dto)
  {
    try
    {
      var user = await _usersService.LoginUser(dto);
      return Ok(user);
    }
    catch (Exception ex)
    {
      return BadRequest(ex.Message);
    }
  }
}
