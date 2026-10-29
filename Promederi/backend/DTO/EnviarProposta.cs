using System.ComponentModel.DataAnnotations;

namespace backend.DTO;

public class EnviarProposta
{
    [Range(1, int.MaxValue)]
    public int ClienteId { get; set; }

    [Required, MaxLength(2000)]
    public string Mensagem { get; set; } = string.Empty;
}

public class AceitarProposta
{
    [Required, MaxLength(256)]
    public string Senha { get; set; } = string.Empty;
}
