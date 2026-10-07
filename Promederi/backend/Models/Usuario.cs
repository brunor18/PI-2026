namespace backend.Models
{
    public class Usuario
    {
        public int Id { get; set; }

        public string nome { get; set; }

        public string email { get; set; }

        public string senha { get; set; }

        public string PIN { get; set; }

        public string numeroTelefone { get; set; }

        public DateTime? UltimaAutenticacaoSenha { get; set; }

        public TipoUsuario TipoUsuario { get; set; }

        // Preenchido somente quando o usuário for cuidador
        public int? IdosoId { get; set; }

        // Navegação: cuidador -> idoso
        public Usuario? Idoso { get; set; }

        // Navegação: idoso -> cuidadores
        public ICollection<Usuario> Cuidadores { get; set; }
            = new List<Usuario>();

        public ICollection<Medicamento> Medicamentos { get; set; }
        = new List<Medicamento>();

        public DateTime createdAt { get; set; } = DateTime.UtcNow;
    }
}
