using MongoDB.Bson.Serialization.Attributes;
using TaskManagerApi.Models;

public class LoginUserDTO
{
  [BsonElement("Email")]
  public string Email { get; set; } = null!;
  [BsonElement("Password")]
  public string Password { get; set; } = null!;
}
