namespace backend.Models
{
    public class Medicamento
    {
        public int Id { get; set; }

        public string nomeMedicamento { get; set; } = string.Empty;

        public string dosagem { get; set; } = string.Empty;

        public string frequencia { get; set; } = string.Empty;

        public DateTime InicioTratamento { get; set; }

        public DateTime FimTratamento { get; set; }
    }
}
