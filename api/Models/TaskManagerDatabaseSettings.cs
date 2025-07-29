namespace TaskManagerApi.Models;

public class TaskManagerDatabaseSettings
{
  public string ConnectionString { get; set; } = null!;
  public string DatabaseName { get; set; } = null!;
  public string ProjectsCollectionName { get; set; } = null!;
  public string UsersCollectionName { get; set; } = null!;
  public string TasksCollectionName { get; set; } = null!;
  public string CommentsCollectionName { get; set; } = null!;
}
