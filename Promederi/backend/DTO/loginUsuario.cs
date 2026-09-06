using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    public class loginUsuario
    {
        [Required]
        [EmailAddress]
        public string email { get; set; } = string.Empty;

        [Required]
        public string PIN { get; set; } = string.Empty;
    }
}           