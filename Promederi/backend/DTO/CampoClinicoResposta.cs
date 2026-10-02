namespace backend.DTO;

public record CampoClinicoResposta(
    int Id, string Nome, string? Descricao, string? Valor, DateTime CreatedAt
);
