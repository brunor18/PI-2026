using System.ComponentModel.DataAnnotations;

namespace backend.DTO;

public class cadastrarProcedimentoCirurgico : IValidatableObject
{
    [Required(ErrorMessage = "Informe a data do procedimento.")]
    public DateOnly? data { get; set; }

    [Required(ErrorMessage = "Informe o tipo de procedimento.")]
    [StringLength(200)]
    public string tipoProcedimento { get; set; } = string.Empty;

    [StringLength(5000)]
    public string? observacoesMedicas { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (data == DateOnly.MinValue)
        {
            yield return new ValidationResult(
                "Informe uma data válida para o procedimento.",
                new[] { nameof(data) }
            );
        }
    }
}
