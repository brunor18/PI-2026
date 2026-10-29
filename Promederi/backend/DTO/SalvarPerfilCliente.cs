using System.ComponentModel.DataAnnotations;

namespace backend.DTO;

public class SalvarPerfilCliente : IValidatableObject
{
    [Required, MaxLength(200)]
    public string Nome { get; set; } = string.Empty;
    [Required, Range(1, 130)]
    public int? Idade { get; set; }
    [Required, MaxLength(30)]
    public string NumeroTelefone { get; set; } = string.Empty;
    [Required, MaxLength(120)]
    public string Cidade { get; set; } = string.Empty;
    [Required, MaxLength(500)]
    public string Endereco { get; set; } = string.Empty;
    [Required, Range(typeof(decimal), "1", "500")]
    public decimal? Peso { get; set; }
    [Required, Range(typeof(decimal), "30", "250")]
    public decimal? Altura { get; set; }
    [Required, MaxLength(2000)]
    public string Descricao { get; set; } = string.Empty;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        var telefone = new string(NumeroTelefone.Where(char.IsAsciiDigit).ToArray());
        if (!(telefone.Length is 10 or 11 || (telefone.Length is 12 or 13 && telefone.StartsWith("55"))))
            yield return new ValidationResult("Informe um telefone com DDD, com ou sem o código 55.", new[] { nameof(NumeroTelefone) });
    }
}
