using System.ComponentModel.DataAnnotations;

namespace backend.DTO;

public class atualizarProcedimentoCirurgico
{
    public DateOnly? data { get; set; }

    [StringLength(200)]
    public string? tipoProcedimento { get; set; }

    [StringLength(5000)]
    public string? observacoesMedicas { get; set; }
}
