using MongoDB.Bson.Serialization.Attributes;
public class LoginUserDTO
{
  [BsonElement("Email")]
  public string Email { get; set; } = null!;
  [BsonElement("Password")]
  public string Password { get; set; } = null!;
}
