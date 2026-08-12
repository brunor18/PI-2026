namespace backend.DTO;

public class atualizarMedicamento
{
    public string nomeMedicamento { get; set; } = string.Empty;

    public string dosagem { get; set; } = string.Empty;

    public string frequencia { get; set; } = string.Empty;

    public DateTime InicioTratamento { get; set; }

    public DateTime FimTratamento { get; set; }
}