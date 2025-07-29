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
  public List<string> AssignedForIds { get; set; } = new();
  public string Description { get; set; } = null!;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime? DueBy { get; set; }
  public Priority Priority { get; set; }
  public Status Status { get; set; } = Status.Created;
  public DateTime? CompletedAt { get; set; }

}
