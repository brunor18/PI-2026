namespace backend.DTO;

public class criarMedicamento
{
    public string nomeMedicamento { get; set; } = string.Empty;

    public string dosagem { get; set; } = string.Empty;

    public string frequencia { get; set; } = string.Empty;

    public string? descricao { get; set; }

    public DateTime InicioTratamento { get; set; }

    public DateTime FimTratamento { get; set; }
}