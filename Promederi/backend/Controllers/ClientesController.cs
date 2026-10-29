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
}
