using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    public class cadastrarUsuario : IValidatableObject
    {
        [Required]
        [MaxLength(200)]
        public string nome { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string senha { get; set; } = string.Empty;

        [Required]
        [RegularExpression(@"^\d{4,6}$",
            ErrorMessage = "O PIN deve possuir entre 4 e 6 dígitos.")]
        public string PIN { get; set; }

        [Required]
        [MaxLength(30)]
        public string numeroTelefone { get; set; } = string.Empty;

        [Range(1, 2, ErrorMessage = "O tipo de usuário deve ser 1 (Idoso) ou 2 (Cuidador).")]
        public int tipoUsuario { get; set; }

        [Range(18, 120)]
        public int? idade { get; set; }

        [MaxLength(20)]
        public string? numero { get; set; }

        [MaxLength(500)]
        public string? endereco { get; set; }

        [MaxLength(2000)]
        public string? descricao { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (tipoUsuario != 2) yield break;
            if (nome.Trim().Length > 200)
                yield return new ValidationResult("Use até 200 caracteres no nome.", new[] { nameof(nome) });
            if (idade is null)
                yield return new ValidationResult("Informe a idade do cuidador.", new[] { nameof(idade) });
            if (string.IsNullOrWhiteSpace(numero))
                yield return new ValidationResult("Informe o número do endereço ou S/N.", new[] { nameof(numero) });
            if (string.IsNullOrWhiteSpace(endereco))
                yield return new ValidationResult("Informe o endereço do cuidador.", new[] { nameof(endereco) });
            if (string.IsNullOrWhiteSpace(descricao))
                yield return new ValidationResult("Informe uma descrição do cuidador.", new[] { nameof(descricao) });
        }
    }
}
