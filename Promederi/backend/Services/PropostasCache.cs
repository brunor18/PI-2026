using Microsoft.Extensions.Caching.Memory;

namespace backend.Services;

public sealed record PropostaServico(
    Guid Id,
    int ClienteUsuarioId,
    int CuidadorUsuarioId,
    int CuidadorId,
    string Mensagem,
    DateTimeOffset CriadaEm,
    DateTimeOffset ExpiraEm);

public sealed class PropostasCache(IMemoryCache cache, TimeProvider clock) : BackgroundService
{
    private readonly Dictionary<Guid, int> indice = new();
    private readonly object sincronizacao = new();
    public SemaphoreSlim Transacoes { get; } = new(1, 1);

    public PropostaServico? Obter(Guid id)
    {
        lock (sincronizacao)
        {
            if (cache.TryGetValue(id, out PropostaServico? proposta)
                && proposta is not null && proposta.ExpiraEm > clock.GetUtcNow())
                return proposta;

            cache.Remove(id);
            indice.Remove(id);
            return null;
        }
    }

    public IReadOnlyList<PropostaServico> Listar(int clienteUsuarioId)
    {
        lock (sincronizacao)
        {
            return indice.Where(item => item.Value == clienteUsuarioId)
                .Select(item => item.Key).ToArray()
                .Select(Obter).OfType<PropostaServico>()
                .OrderByDescending(p => p.CriadaEm).ToArray();
        }
    }

    public PropostaServico? Criar(int clienteUsuarioId, int cuidadorUsuarioId, int cuidadorId, string mensagem)
    {
        lock (sincronizacao)
        {
            if (Listar(clienteUsuarioId).Any(p => p.CuidadorUsuarioId == cuidadorUsuarioId))
                return null;

            var agora = clock.GetUtcNow();
            var proposta = new PropostaServico(
                Guid.NewGuid(), clienteUsuarioId, cuidadorUsuarioId, cuidadorId,
                mensagem, agora, agora.AddHours(1));
            indice[proposta.Id] = clienteUsuarioId;
            cache.Set(proposta.Id, proposta, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1),
            }.RegisterPostEvictionCallback((key, _, _, _) =>
            {
                lock (sincronizacao) indice.Remove((Guid)key);
            }));
            return proposta;
        }
    }

    public void Remover(Guid id)
    {
        lock (sincronizacao)
        {
            cache.Remove(id);
            indice.Remove(id);
        }
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromMinutes(1));
        try
        {
            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                Guid[] ids;
                lock (sincronizacao) ids = indice.Keys.ToArray();
                foreach (var id in ids) Obter(id);
            }
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) { }
    }
}
