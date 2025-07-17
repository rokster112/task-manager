using MongoDB.Bson.Serialization.Attributes;

public class UpdateUserInfoDTO
{
  [BsonElement("Email")]
  public string? Email { get; set; }
  [BsonElement("Password")]
  public string? Password { get; set; }
  [BsonElement("Password")]
  public string? OldPassword { get; set; }
  public string? FullName { get; set; }
  public string? Position { get; set; }
  public string? AvatarUrl { get; set; }

}
