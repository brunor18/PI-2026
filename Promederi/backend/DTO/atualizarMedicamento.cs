namespace backend.DTO
{
    public class atualizarMedicamento
    {
        public string? nomeMedicamento { get; set; }

        public string? dosagem { get; set; }

        public string? frequencia { get; set; }

        public DateTime? InicioTratamento { get; set; }

        public DateTime? FimTratamento { get; set; }
    }
}