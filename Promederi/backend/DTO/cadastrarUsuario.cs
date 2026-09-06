using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    public class cadastrarUsuario
    {
        [Required]
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
        public string numeroTelefone { get; set; } = string.Empty;
    }
}