namespace backend.Models;

public class ProcedimentoCirurgico
{
    public int id { get; set; }

    public int usuarioId { get; set; }

    public DateOnly data { get; set; }

    public string tipoProcedimento { get; set; } = string.Empty;

    public string? observacoesMedicas { get; set; }

    public Usuario usuario { get; set; } = null!;
}
