using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaskManagerApi.Models;

public class Comment
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string? CommentId { get; set; }
  public string TaskId { get; set; } = null!;
  public string CommentBy { get; set; } = null!;
  public string Body { get; set; } = null!;
  public DateTime CreatedAt { get; set; }
}
