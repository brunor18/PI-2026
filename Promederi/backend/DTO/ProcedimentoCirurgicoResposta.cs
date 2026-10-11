namespace backend.DTO;

public record ProcedimentoCirurgicoResposta(
    int id,
    int usuarioId,
    DateOnly data,
    string tipoProcedimento,
    string? observacoesMedicas
);
