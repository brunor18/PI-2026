namespace backend.Models;

public class CampoClinico
{
    public int Id { get; set; }

    public int UsuarioId { get; set; }

    public string Nome { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    public string? Valor { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Usuario Usuario { get; set; } = null!;
}
