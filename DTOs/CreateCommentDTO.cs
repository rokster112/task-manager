public class CreateCommentDTO
{
    public string Body { get; set; } = null!;
    public IFormFile? Image { get; set; }
}
