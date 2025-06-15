using MongoDB.Bson.Serialization.Attributes;
using TaskManagerApi.Models;

public class RegisterUserDTO
{
  [BsonElement("Email")]
  public string Email { get; set; } = null!;
  [BsonElement("Password")]
  public string Password { get; set; } = null!;
  public string FullName { get; set; } = null!;
  public string Position { get; set; } = null!;
  public string? AvatarUrl { get; set; }

}
