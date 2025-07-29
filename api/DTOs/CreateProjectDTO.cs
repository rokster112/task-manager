using TaskManagerApi.Models;

public class CreateProjectDTO
{
  public string Title { get; set; } = null!;
  public DateTime? StartDate { get; set; }
  public DateTime? EndDate { get; set; }
  public string Description { get; set; } = null!;
  public Priority Priority { get; set; }
  public Status Status { get; set; } = Status.Created;

  public string ClientName { get; set; } = null!;
}
