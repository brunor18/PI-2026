namespace backend.Models;

public class Cliente
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public Usuario Usuario { get; set; } = null!;
    public string Nome { get; set; } = string.Empty;
    public int? Idade { get; set; }
    public string NumeroTelefone { get; set; } = string.Empty;
    public string Cidade { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public decimal? Peso { get; set; }
    // Altura em centímetros e peso em quilogramas.
    public decimal? Altura { get; set; }
    public string Descricao { get; set; } = string.Empty;
}
