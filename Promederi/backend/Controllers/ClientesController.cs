using System.Security.Claims;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Promederi.Controllers;

[Authorize]
[ApiController]
[Route("api/clientes")]
public class ClientesController(AppDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Listar(CancellationToken cancellationToken)
    {
        if (User.FindFirst("token_type")?.Value != "access"
            || !int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var usuarioId))
            return Forbid();

        if (!await context.usuarios.AnyAsync(u => u.Id == usuarioId
            && u.TipoUsuario == TipoUsuario.Cuidador, cancellationToken))
            return Forbid();

        // Inclui todos os perfis de idosos, com ou sem cuidadores.
        var clientes = await context.clientes.AsNoTracking()
            .Where(c => c.Usuario.TipoUsuario == TipoUsuario.Idoso)
            .OrderBy(c => c.Nome).ThenBy(c => c.UsuarioId)
            .Select(c => new
            {
                id = c.UsuarioId,
                clienteId = c.Id,
                nome = c.Nome,
                idade = c.Idade,
                numeroTelefone = c.NumeroTelefone,
                endereco = c.Endereco,
                cidade = c.Cidade,
                peso = c.Peso,
                altura = c.Altura,
                descricao = c.Descricao,
                quantidadeCuidadores = c.Usuario.CuidadoresAtendentes.Count(a => a.Usuario.TipoUsuario == TipoUsuario.Cuidador),
                atendidoPorVoce = c.Usuario.CuidadoresAtendentes.Any(a => a.UsuarioId == usuarioId),
            })
            .ToListAsync(cancellationToken);

        return Ok(clientes);
    }

    [HttpGet("meus")]
    public async Task<IActionResult> MeusClientes(CancellationToken cancellationToken)
    {
        if (User.FindFirst("token_type")?.Value != "access"
            || !int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var usuarioId))
            return Forbid();

        if (!await context.usuarios.AnyAsync(u => u.Id == usuarioId
            && u.TipoUsuario == TipoUsuario.Cuidador, cancellationToken))
            return Forbid();

        // Os vínculos são verificados no servidor antes de consultar os registros.
        var clientes = await context.clientes.AsNoTracking()
            .Where(c => c.Usuario.TipoUsuario == TipoUsuario.Idoso
                && c.Usuario.CuidadoresAtendentes.Any(a => a.UsuarioId == usuarioId))
            .OrderBy(c => c.Nome).ThenBy(c => c.UsuarioId)
            .Select(c => new
            {
                id = c.UsuarioId,
                nome = c.Nome,
                idade = c.Idade,
                numeroTelefone = c.NumeroTelefone,
                endereco = c.Endereco,
                cidade = c.Cidade,
                peso = c.Peso,
                altura = c.Altura,
                descricao = c.Descricao,
            })
            .ToListAsync(cancellationToken);

        if (clientes.Count == 0) return Ok(Array.Empty<object>());
        var ids = clientes.Select(c => c.id).ToList();

        var medicamentos = await context.medicamentos.AsNoTracking()
            .Where(m => ids.Contains(m.UsuarioId))
            .OrderByDescending(m => m.Id)
            .Select(m => new
            {
                id = m.Id, usuarioId = m.UsuarioId, nomeMedicamento = m.nomeMedicamento,
                dosagem = m.dosagem, frequencia = m.frequencia, descricao = m.descricao,
                inicioTratamento = m.InicioTratamento, fimTratamento = m.FimTratamento,
                createdAt = m.createdAt,
            }).ToListAsync(cancellationToken);

        var procedimentos = await context.procedimentosCirurgicos.AsNoTracking()
            .Where(p => ids.Contains(p.usuarioId))
            .OrderByDescending(p => p.id)
            .Select(p => new
            {
                id = p.id, usuarioId = p.usuarioId, data = p.data,
                tipoProcedimento = p.tipoProcedimento, observacoesMedicas = p.observacoesMedicas,
            }).ToListAsync(cancellationToken);

        var campos = await context.camposClinicos.AsNoTracking()
            .Where(c => ids.Contains(c.UsuarioId))
            .OrderByDescending(c => c.Id)
            .Select(c => new
            {
                id = c.Id, usuarioId = c.UsuarioId, nome = c.Nome,
                valor = c.Valor, descricao = c.Descricao, createdAt = c.CreatedAt,
            }).ToListAsync(cancellationToken);

        var medicamentosPorCliente = medicamentos.ToLookup(m => m.usuarioId);
        var procedimentosPorCliente = procedimentos.ToLookup(p => p.usuarioId);
        var camposPorCliente = campos.ToLookup(c => c.usuarioId);

        return Ok(clientes.Select(c => new
        {
            cliente = c,
            registros = new
            {
                medicamentos = medicamentosPorCliente[c.id].ToArray(),
                procedimentos = procedimentosPorCliente[c.id].ToArray(),
                campos = camposPorCliente[c.id].ToArray(),
            },
        }));
    }

}
