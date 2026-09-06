using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    public class confirmarSenha
    {
        [Required]
        public string senha { get; set; } = string.Empty;
    }
}