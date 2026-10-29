using System.Security.Claims;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Promederi.Controllers;

[Authorize]
[ApiController]
[Route("api/cuidadores")]
public class CuidadoresController(AppDbContext context) : UsuarioControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Listar(CancellationToken cancellationToken)
    {
        if (User.FindFirst("token_type")?.Value != "access"
            || !int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var usuarioId))
            return Forbid();

        var cuidadores = await context.cuidadores.AsNoTracking()
            .Where(c => c.Usuario.TipoUsuario == TipoUsuario.Cuidador)
            .OrderBy(c => c.Nome).ThenBy(c => c.Id)
            .Select(c => new
            {
                id = c.Id,
                usuarioId = c.UsuarioId,
                numeroTelefone = c.Usuario.numeroTelefone,
                nome = c.Nome,
                idade = c.Idade,
                endereco = c.Endereco,
                numero = c.Numero,
                descricao = c.Descricao,
                idososAtendidos = c.Idosos.Count,
                atendeVoce = c.Idosos.Any(i => i.Id == usuarioId),
            })
            .ToListAsync(cancellationToken);

        return Ok(cuidadores);
    }
}
