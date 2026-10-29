namespace backend.Models;

public class Cuidadores
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public Usuario Usuario { get; set; } = null!;
    public string Nome { get; set; } = string.Empty;
    // Perfis anteriores à migração não possuem idade informada.
    public int? Idade { get; set; }
    public string Numero { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public ICollection<Usuario> Idosos { get; set; } = new List<Usuario>();
}
