using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaskManagerApi.Models;

public class AuthUser
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string? UserId { get; set; }
  [BsonElement("Email")]
  public string Email { get; set; } = null!;
  [BsonElement("Password")]
  public string Password { get; set; } = null!;
  public string FullName { get; set; } = null!;
  public string Position { get; set; } = null!;
  public string? AvatarUrl { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


}
