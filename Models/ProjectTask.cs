using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaskManagerApi.Models;

public class ProjectTask
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string? TaskId { get; set; }
  public string ProjectId { get; set; } = null!;
  public string Title { get; set; } = null!;
  public List<User> AssignedFor { get; set; } = null!;
  public string Description { get; set; } = null!;
  public DateTime CreatedAt { get; set; }
  public DateTime DueBy { get; set; }
  public Priority Priority { get; set; }
  public Status Status { get; set; }
  public DateTime CompletedAt { get; set; }
  public List<Comment> Comments { get; set; } = new();

}
