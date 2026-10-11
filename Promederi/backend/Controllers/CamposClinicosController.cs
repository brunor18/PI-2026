using backend.Data;
using backend.DTO;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Promederi.Controllers;

[Authorize]
[ApiController]
[Route("api/usuarios/{usuarioId:int}/campos-clinicos")]
public class CamposClinicosController(AppDbContext context) : UsuarioControllerBase
{
    private static CampoClinicoResposta Resposta(CampoClinico campo) =>
        new(campo.Id, campo.Nome, campo.Descricao, campo.Valor, campo.CreatedAt);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CampoClinicoResposta>>> Listar(int usuarioId)
    {
        if (!usuarioTemAcesso(usuarioId)) return Forbid();

        var campos = await context.camposClinicos.AsNoTracking()
            .Where(c => c.UsuarioId == usuarioId).OrderBy(c => c.Id)
            .Select(c => new CampoClinicoResposta(c.Id, c.Nome, c.Descricao, c.Valor, c.CreatedAt))
            .ToListAsync();
        return Ok(campos);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CampoClinicoResposta>> Obter(int usuarioId, int id)
    {
        if (!usuarioTemAcesso(usuarioId)) return Forbid();

        var campo = await context.camposClinicos.AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id && c.UsuarioId == usuarioId);
        if (campo is null) return NotFound();
        return Ok(Resposta(campo));
    }

    [HttpPost]
    public async Task<ActionResult<CampoClinicoResposta>> Criar(int usuarioId, SalvarCampoClinico dto)
    {
        if (!usuarioTemAcesso(usuarioId)) return Forbid();
        if (!await context.usuarios.AnyAsync(u => u.Id == usuarioId)) return NotFound();
        if (string.IsNullOrWhiteSpace(dto.Nome))
            return BadRequest(new { mensagem = "Informe o nome do campo clínico." });

        var campo = new CampoClinico
        {
            UsuarioId = usuarioId,
            Nome = dto.Nome.Trim(),
            Descricao = dto.Descricao,
            Valor = dto.Valor
        };
        context.camposClinicos.Add(campo);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(Obter), new { usuarioId, id = campo.Id }, Resposta(campo));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<CampoClinicoResposta>> Atualizar(int usuarioId, int id, SalvarCampoClinico dto)
    {
        if (!usuarioTemAcesso(usuarioId)) return Forbid();
        var campo = await context.camposClinicos
            .FirstOrDefaultAsync(c => c.Id == id && c.UsuarioId == usuarioId);
        if (campo is null) return NotFound();
        if (string.IsNullOrWhiteSpace(dto.Nome))
            return BadRequest(new { mensagem = "Informe o nome do campo clínico." });

        campo.Nome = dto.Nome.Trim();
        campo.Descricao = dto.Descricao;
        campo.Valor = dto.Valor;
        await context.SaveChangesAsync();
        return Ok(Resposta(campo));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Excluir(int usuarioId, int id)
    {
        if (!usuarioTemAcesso(usuarioId)) return Forbid();
        var campo = await context.camposClinicos
            .FirstOrDefaultAsync(c => c.Id == id && c.UsuarioId == usuarioId);
        if (campo is null) return NotFound();
        context.camposClinicos.Remove(campo);
        await context.SaveChangesAsync();
        return NoContent();
    }
}
