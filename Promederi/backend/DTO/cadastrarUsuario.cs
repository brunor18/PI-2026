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
        public string senha { get; set; } = string.Empty;

        [Required]
        public int PIN { get; set; }

        [Required]
        public string numeroTelefone { get; set; } = string.Empty;
    }
}