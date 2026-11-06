namespace backend.Models;

public class Anotacao
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public Usuario Usuario { get; set; } = null!;
    public int AutorUsuarioId { get; set; }
    public Usuario AutorUsuario { get; set; } = null!;
    public string Texto { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
