using TaskManagerApi.Models;

public class CreateProjectTaskDTO
{
  public string Title { get; set; } = null!;
  public List<string> AssignedForIds { get; set; } = new();
  public string Description { get; set; } = null!;
  public DateTime? DueBy { get; set; }
  public Priority Priority { get; set; }
  public Status Status { get; set; } = Status.Created;

}
