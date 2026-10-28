using backend.Data;
using backend.DTO;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Promederi.Controllers;

[Authorize]
[ApiController]
[Route("api/usuarios/{usuarioId:int}/procedimentos-cirurgicos")]
public class ProcedimentosCirurgicosController(AppDbContext context) : UsuarioControllerBase
{
    private static ProcedimentoCirurgicoResposta criarResposta(ProcedimentoCirurgico procedimento)
    {
        return new ProcedimentoCirurgicoResposta(
            procedimento.id,
            procedimento.usuarioId,
            procedimento.data,
            procedimento.tipoProcedimento,
            procedimento.observacoesMedicas
        );
    }

    [HttpPost]
    public async Task<ActionResult<ProcedimentoCirurgicoResposta>> cadastrar(
        int usuarioId,
        cadastrarProcedimentoCirurgico dto)
    {
        if (!usuarioTemAcesso(usuarioId))
        {
            return Forbid();
        }

        if (!await context.usuarios.AnyAsync(usuario => usuario.Id == usuarioId))
        {
            return NotFound(new { mensagem = "Usuário não encontrado." });
        }

        if (dto.data is null || dto.data == DateOnly.MinValue)
        {
            return BadRequest(new { mensagem = "Informe uma data válida para o procedimento." });
        }

        if (string.IsNullOrWhiteSpace(dto.tipoProcedimento))
        {
            return BadRequest(new { mensagem = "Informe o tipo de procedimento." });
        }

        var procedimento = new ProcedimentoCirurgico
        {
            usuarioId = usuarioId,
            data = dto.data.Value,
            tipoProcedimento = dto.tipoProcedimento.Trim(),
            observacoesMedicas = dto.observacoesMedicas?.Trim()
        };

        context.procedimentosCirurgicos.Add(procedimento);
        await context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(obter),
            new { usuarioId, id = procedimento.id },
            criarResposta(procedimento)
        );
    }

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<ProcedimentoCirurgicoResposta>> atualizar(
        int usuarioId,
        int id,
        atualizarProcedimentoCirurgico dto)
    {
        if (!usuarioTemAcesso(usuarioId))
        {
            return Forbid();
        }

        var procedimento = await context.procedimentosCirurgicos
            .FirstOrDefaultAsync(procedimento => procedimento.id == id
                && procedimento.usuarioId == usuarioId);

        if (procedimento is null)
        {
            return NotFound(new { mensagem = "Procedimento cirúrgico não encontrado." });
        }

        if (dto.data == DateOnly.MinValue)
        {
            return BadRequest(new { mensagem = "Informe uma data válida para o procedimento." });
        }

        if (dto.tipoProcedimento is not null && string.IsNullOrWhiteSpace(dto.tipoProcedimento))
        {
            return BadRequest(new { mensagem = "Informe o tipo de procedimento." });
        }

        if (dto.data.HasValue)
        {
            procedimento.data = dto.data.Value;
        }

        if (dto.tipoProcedimento is not null)
        {
            procedimento.tipoProcedimento = dto.tipoProcedimento.Trim();
        }

        if (dto.observacoesMedicas is not null)
        {
            procedimento.observacoesMedicas = dto.observacoesMedicas.Trim();
        }

        await context.SaveChangesAsync();
        return Ok(criarResposta(procedimento));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> excluir(int usuarioId, int id)
    {
        if (!usuarioTemAcesso(usuarioId))
        {
            return Forbid();
        }

        var procedimento = await context.procedimentosCirurgicos
            .FirstOrDefaultAsync(procedimento => procedimento.id == id
                && procedimento.usuarioId == usuarioId);

        if (procedimento is null)
        {
            return NotFound(new { mensagem = "Procedimento cirúrgico não encontrado." });
        }

        context.procedimentosCirurgicos.Remove(procedimento);
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProcedimentoCirurgicoResposta>>> listar(int usuarioId)
    {
        if (!usuarioTemAcesso(usuarioId))
        {
            return Forbid();
        }

        var procedimentos = await context.procedimentosCirurgicos
            .AsNoTracking()
            .Where(procedimento => procedimento.usuarioId == usuarioId)
            .OrderByDescending(procedimento => procedimento.data)
            .ThenByDescending(procedimento => procedimento.id)
            .Select(procedimento => new ProcedimentoCirurgicoResposta(
                procedimento.id,
                procedimento.usuarioId,
                procedimento.data,
                procedimento.tipoProcedimento,
                procedimento.observacoesMedicas
            ))
            .ToListAsync();

        return Ok(procedimentos);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProcedimentoCirurgicoResposta>> obter(int usuarioId, int id)
    {
        if (!usuarioTemAcesso(usuarioId))
        {
            return Forbid();
        }

        var procedimento = await context.procedimentosCirurgicos
            .AsNoTracking()
            .FirstOrDefaultAsync(procedimento => procedimento.id == id
                && procedimento.usuarioId == usuarioId);

        if (procedimento is null)
        {
            return NotFound(new { mensagem = "Procedimento cirúrgico não encontrado." });
        }

        return Ok(criarResposta(procedimento));
    }
}
