using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaskManagerApi.Models;

public enum Priority
{
  Low = 1,
  Medium = 2,
  High = 3,
  Urgent = 4
}

public enum Status
{
  InProgress = 1,
  OnHold = 2,
  Completed = 3,
  Cancelled = 4,
  Created = 5,
}

public class Project
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string? Id { get; set; }
  public string Title { get; set; } = null!;
  public List<UserInfoDTO> Users { get; set; } = null!;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime? StartDate { get; set; }
  public DateTime? EndDate { get; set; }
  public Status Status { get; set; } = Status.Created;
  public string Description { get; set; } = null!;
  public Priority Priority { get; set; }
  public UserInfoDTO HeadOfProject { get; set; } = null!;
  public string? ClientName { get; set; }
}
