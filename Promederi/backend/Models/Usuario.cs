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

        public ICollection<Medicamento> Medicamentos { get; set; }
        = new List<Medicamento>();
    }
}
