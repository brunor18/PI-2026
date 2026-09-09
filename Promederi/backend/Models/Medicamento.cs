namespace backend.Models
{
    public class Medicamento
    {
        public int Id { get; set; }

        public int UsuarioId { get; set; }

        public string nomeMedicamento { get; set; } = string.Empty;

        public string dosagem { get; set; } = string.Empty;

        public string frequencia { get; set; } = string.Empty;

        public string? descricao { get; set; }

        public DateTime InicioTratamento { get; set; }

        public DateTime FimTratamento { get; set; }

        public Usuario Usuario { get; set; } = null!;

        public DateTime createdAt { get; set; } = DateTime.UtcNow;
    }
}
