namespace backend.Models
{
    public class Usuario
    {
        public int Id { get; set; }

        public string nome { get; set; }

        public string email { get; set; }

        public string senha { get; set; }

        public int PIN { get; set; }

        public string numeroTelefone { get; set; }

        public List<Medicamento> medicamentos { get; set; }
    }
}
