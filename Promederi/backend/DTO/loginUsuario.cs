using System.ComponentModel.DataAnnotations;
using backend.Models;

namespace backend.DTO
{
    public class loginUsuario
    {
        [Required]
        [EmailAddress]
        public string email { get; set; } = string.Empty;

        [Required]
        public string PIN { get; set; } = string.Empty;

        [Required]
        public TipoUsuario TipoUsuario { get; set; }
    }
}           