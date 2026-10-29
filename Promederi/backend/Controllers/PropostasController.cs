using System.Security.Claims;
using backend.Data;
using backend.DTO;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace Promederi.Controllers;

[Authorize]
[ApiController]
[Route("api/propostas")]
public class PropostasController(AppDbContext context, PropostasCache propostas) : ControllerBase
{
    private int? UsuarioId() => User.FindFirst("token_type")?.Value == "access"
        && int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var id) ? id : null;

    [HttpPost]
    [EnableRateLimiting("propostas")]
    public async Task<IActionResult> Enviar(EnviarProposta dto, CancellationToken cancellationToken)
    {
        var id = UsuarioId();
        if (id is null) return Forbid();
        if (string.IsNullOrWhiteSpace(dto.Mensagem))
            return BadRequest(new { mensagem = "Descreva por que deseja cuidar deste cliente." });

        await propostas.Transacoes.WaitAsync(cancellationToken);
        try
        {
            var cuidador = await context.cuidadores.FirstOrDefaultAsync(c => c.UsuarioId == id
                && c.Usuario.TipoUsuario == TipoUsuario.Cuidador, cancellationToken);
            if (cuidador is null) return Forbid();
            if (!await context.clientes.AnyAsync(c => c.UsuarioId == dto.ClienteId
                && c.Usuario.TipoUsuario == TipoUsuario.Idoso, cancellationToken))
                return NotFound(new { mensagem = "Cliente não encontrado." });
            if (await context.cuidadores.AnyAsync(c => c.Id == cuidador.Id
                && c.Idosos.Any(i => i.Id == dto.ClienteId), cancellationToken))
                return Conflict(new { mensagem = "Este cliente já está vinculado a você." });

            var proposta = propostas.Criar(dto.ClienteId, id.Value, cuidador.Id, dto.Mensagem.Trim());
            if (proposta is null)
                return Conflict(new { mensagem = "Você já possui uma proposta pendente para este cliente." });
            return StatusCode(201, new
            {
                id = proposta.Id,
                expiraEm = proposta.ExpiraEm,
                mensagem = "Proposta enviada. O cliente será notificado.",
            });
        }
        finally { propostas.Transacoes.Release(); }
    }

    [HttpGet("notificacoes")]
    public async Task<IActionResult> Notificacoes(CancellationToken cancellationToken)
    {
        var id = UsuarioId();
        if (id is null || !await context.usuarios.AnyAsync(u => u.Id == id
            && u.TipoUsuario == TipoUsuario.Idoso, cancellationToken)) return Forbid();

        var pendentes = propostas.Listar(id.Value);
        var ids = pendentes.Select(p => p.CuidadorId).Distinct().ToList();
        var cuidadores = await context.cuidadores.AsNoTracking()
            .Where(c => ids.Contains(c.Id) && c.Usuario.TipoUsuario == TipoUsuario.Cuidador)
            .Select(c => new { id = c.Id, nome = c.Nome, idade = c.Idade, descricao = c.Descricao })
            .ToDictionaryAsync(c => c.id, cancellationToken);

        return Ok(pendentes.Where(p => propostas.Obter(p.Id) is not null && cuidadores.ContainsKey(p.CuidadorId))
            .Select(p => new
            {
                id = p.Id,
                mensagem = p.Mensagem,
                criadaEm = p.CriadaEm,
                expiraEm = p.ExpiraEm,
                cuidador = cuidadores[p.CuidadorId],
            }));
    }

    [HttpPost("{id:guid}/aceitar")]
    [EnableRateLimiting("propostas")]
    public async Task<IActionResult> Aceitar(Guid id, AceitarProposta dto, CancellationToken cancellationToken)
    {
        var usuarioId = UsuarioId();
        if (usuarioId is null) return Forbid();
        await propostas.Transacoes.WaitAsync(cancellationToken);
        try
        {
            var proposta = propostas.Obter(id);
            if (proposta is null || proposta.ClienteUsuarioId != usuarioId)
                return NotFound(new { mensagem = "Proposta expirada ou indisponível." });
            var cliente = await context.usuarios.FirstOrDefaultAsync(u => u.Id == usuarioId
                && u.TipoUsuario == TipoUsuario.Idoso, cancellationToken);
            if (cliente is null) return Forbid();

            // A identidade é confirmada exclusivamente pelo hash da senha, nunca pelo PIN.
            bool senhaValida;
            try { senhaValida = BCrypt.Net.BCrypt.Verify(dto.Senha, cliente.senha); }
            catch (BCrypt.Net.SaltParseException) { senhaValida = false; }
            catch (ArgumentException) { senhaValida = false; }
            if (!senhaValida)
                return BadRequest(new { mensagem = "Senha incorreta. Informe a senha da conta, não o PIN." });

            if (propostas.Obter(id) is null)
                return NotFound(new { mensagem = "A proposta expirou. Peça ao cuidador para enviar outra." });
            var cuidador = await context.cuidadores.FirstOrDefaultAsync(c => c.Id == proposta.CuidadorId
                && c.UsuarioId == proposta.CuidadorUsuarioId
                && c.Usuario.TipoUsuario == TipoUsuario.Cuidador, cancellationToken);
            if (cuidador is null) return NotFound(new { mensagem = "Cuidador não encontrado." });

            if (!await context.cuidadores.AnyAsync(c => c.Id == cuidador.Id
                && c.Idosos.Any(i => i.Id == cliente.Id), cancellationToken))
            {
                cuidador.Idosos.Add(cliente);
                await context.SaveChangesAsync(cancellationToken);
            }
            propostas.Remover(id);
            return Ok(new { mensagem = "Proposta aceita. O cuidador foi vinculado à sua conta." });
        }
        finally { propostas.Transacoes.Release(); }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Recusar(Guid id, CancellationToken cancellationToken)
    {
        var usuarioId = UsuarioId();
        if (usuarioId is null || !await context.usuarios.AnyAsync(u => u.Id == usuarioId
            && u.TipoUsuario == TipoUsuario.Idoso, cancellationToken)) return Forbid();
        await propostas.Transacoes.WaitAsync(cancellationToken);
        try
        {
            var proposta = propostas.Obter(id);
            if (proposta is null || proposta.ClienteUsuarioId != usuarioId)
                return NotFound(new { mensagem = "Proposta expirada ou indisponível." });
            propostas.Remover(id);
            return NoContent();
        }
        finally { propostas.Transacoes.Release(); }
    }
}
