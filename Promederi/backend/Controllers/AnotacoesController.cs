using System.Security.Claims;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Promederi.Controllers;

[Authorize]
[ApiController]
[Route("api/anotacoes")]
public class AnotacoesController(AppDbContext context) : ControllerBase
{
    private int? UsuarioId => User.FindFirst("token_type")?.Value == "access"
        && int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var id) ? id : null;

    private async Task<bool> TemAcesso(int usuarioId, CancellationToken ct)
    {
        if (UsuarioId is not int autor) return false;
        if (autor == usuarioId) return true;
        return await context.cuidadores.AnyAsync(c => c.UsuarioId == autor
            && c.Idosos.Any(i => i.Id == usuarioId), ct);
    }

    [HttpGet]
    public async Task<IActionResult> Listar(CancellationToken ct)
    {
        if (UsuarioId is not int autor) return Forbid();
        var query = context.anotacoes.AsNoTracking().Where(a => a.UsuarioId == autor);
        if (await context.usuarios.AnyAsync(u => u.Id == autor && u.TipoUsuario == TipoUsuario.Cuidador, ct))
        {
            query = context.anotacoes.AsNoTracking().Where(a => context.cuidadores
                .Where(c => c.UsuarioId == autor).SelectMany(c => c.Idosos).Select(i => i.Id).Contains(a.UsuarioId));
        }
        return Ok(await query.OrderByDescending(a => a.CreatedAt).Select(a => new
        {
            a.Id, usuarioId = a.UsuarioId, autorUsuarioId = a.AutorUsuarioId, autor = a.AutorUsuario.nome,
            texto = a.Texto, criadaEm = a.CreatedAt, atualizadaEm = a.UpdatedAt,
            cliente = a.Usuario.PerfilCliente!.Nome
        }).ToListAsync(ct));
    }

    [HttpPost]
    public async Task<IActionResult> Criar(AnotacaoDto dto, CancellationToken ct)
    {
        if (!await TemAcesso(dto.UsuarioId, ct) || UsuarioId is not int autor) return Forbid();
        if (string.IsNullOrWhiteSpace(dto.Texto)) return BadRequest(new { mensagem = "Informe o texto da anotação." });
        var anotacao = new Anotacao { UsuarioId = dto.UsuarioId, AutorUsuarioId = autor, Texto = dto.Texto.Trim() };
        context.anotacoes.Add(anotacao);
        await context.SaveChangesAsync(ct);
        var nomeAutor = await context.usuarios.Where(u => u.Id == autor).Select(u => u.nome).FirstAsync(ct);
        return Created("", new
        {
            id = anotacao.Id, usuarioId = anotacao.UsuarioId, autorUsuarioId = anotacao.AutorUsuarioId,
            autor = nomeAutor, texto = anotacao.Texto, criadaEm = anotacao.CreatedAt, atualizadaEm = anotacao.UpdatedAt,
        });
    }

    [HttpPatch("{id:int}")]
    public async Task<IActionResult> Atualizar(int id, AnotacaoDto dto, CancellationToken ct)
    {
        if (UsuarioId is not int autor) return Forbid();
        var anotacao = await context.anotacoes.FirstOrDefaultAsync(a => a.Id == id && a.AutorUsuarioId == autor, ct);
        if (anotacao is null) return NotFound();
        if (string.IsNullOrWhiteSpace(dto.Texto)) return BadRequest(new { mensagem = "Informe o texto da anotação." });
        anotacao.Texto = dto.Texto.Trim();
        anotacao.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);
        return Ok(new { id = anotacao.Id, texto = anotacao.Texto, atualizadaEm = anotacao.UpdatedAt });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Excluir(int id, CancellationToken ct)
    {
        if (UsuarioId is not int autor) return Forbid();
        var anotacao = await context.anotacoes.FirstOrDefaultAsync(a => a.Id == id && a.AutorUsuarioId == autor, ct);
        if (anotacao is null) return NotFound();
        context.anotacoes.Remove(anotacao);
        await context.SaveChangesAsync(ct);
        return NoContent();
    }

    public sealed class AnotacaoDto
    {
        public int UsuarioId { get; set; }
        public string Texto { get; set; } = string.Empty;
    }
}
