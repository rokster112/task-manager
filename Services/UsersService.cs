using TaskManagerApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Microsoft.AspNetCore.Mvc;
using ZstdSharp;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace TaskManagerApi.Services;

public class UsersService
{
  private readonly IMongoCollection<AuthUser> _usersCollection;

  private readonly IConfiguration _config;

  public UsersService(IOptions<TaskManagerDatabaseSettings> dbSettings, IConfiguration config)
  {
    _config = config;

    var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
    var mongoDatabase = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
    _usersCollection = mongoDatabase.GetCollection<AuthUser>(dbSettings.Value.UsersCollectionName);
  }

  public async Task<string> RegisterUser(RegisterUserDTO dto)
  {
    var existingUser = await _usersCollection.Find(u => u.Email == dto.Email).FirstOrDefaultAsync();
    if (existingUser != null) throw new Exception("User already exists");

    if (string.IsNullOrWhiteSpace(dto.Email)) throw new Exception("Email is required");
    if (string.IsNullOrWhiteSpace(dto.Password)) throw new Exception("Password is required");
    if (string.IsNullOrWhiteSpace(dto.FullName)) throw new Exception("Full Name is required");
    if (string.IsNullOrWhiteSpace(dto.Position)) throw new Exception("Position is required");

    var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

    var user = new AuthUser
    {
      Email = dto.Email,
      Password = passwordHash,
      FullName = dto.FullName,
      Position = dto.Position,
      AvatarUrl = dto.AvatarUrl,
    };

    await _usersCollection.InsertOneAsync(user);
    return user.UserId;
  }

  public async Task<string> LoginUser(LoginUserDTO dto)
  {
    if (string.IsNullOrWhiteSpace(dto.Email)) throw new Exception("Email field is empty");
    if (string.IsNullOrWhiteSpace(dto.Password)) throw new Exception("Password field is empty");

    var existingUser = await _usersCollection.Find(u => u.Email == dto.Email).FirstOrDefaultAsync();
    if (existingUser is null) throw new Exception("Email or password invalid");
    bool isValid = BCrypt.Net.BCrypt.Verify(dto.Password, existingUser.Password);
    if (!isValid) throw new Exception("Email or password invalid");

    var token = GenerateJwtToken(existingUser.UserId, existingUser.Email);
    return token;
  }

  private string GenerateJwtToken(string userId, string email)
  {
    var secretKey = "jdkgasdiuasdlbaskjgasdiukaksbdashjdafsdhjakbsdbaskhd";
    // var secretKey = _config["Jwt:Key"];
    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

    var claims = new[] {
        new Claim("UserId", userId),
        new Claim("Email", email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
    };

    var token = new JwtSecurityToken(
    // issuer: _config["Jwt:Issuer"],
    issuer: "TaskManager",
    // audience: _config["Jwt:Audience"],
    audience: "TaskManager",
    claims: claims,
    expires: DateTime.UtcNow.AddHours(168),
    signingCredentials: credentials);

    return new JwtSecurityTokenHandler().WriteToken(token);
  }
}
