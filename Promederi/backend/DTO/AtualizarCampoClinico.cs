using System.ComponentModel.DataAnnotations;

namespace backend.DTO;

public class AtualizarCampoClinico
{
    [StringLength(100)]
    public string? Nome { get; set; }

    [StringLength(500)]
    public string? Descricao { get; set; }

    [StringLength(5000)]
    public string? Valor { get; set; }
}
