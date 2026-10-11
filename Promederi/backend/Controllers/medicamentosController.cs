using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTO;
using backend.Models;
using Microsoft.AspNetCore.Authorization;


namespace Promederi.Controllers;

[Authorize]
[ApiController]
[Route("api/usuarios/{usuarioId}/medicamentos")]
public class MedicamentosController : UsuarioControllerBase
{
    private readonly AppDbContext _context;

    public MedicamentosController(AppDbContext context)
    {
        _context = context;
    }




    // GET: api/usuarios/1/medicamentos/
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Medicamento>>> GetMedicamentos(int usuarioId)
    {

        if (!usuarioTemAcesso(usuarioId))
        {
            return Forbid();
        }


        var medicamentos = await _context.medicamentos
        .Where(m => m.UsuarioId == usuarioId)
        .ToListAsync();

        if (medicamentos.Count == 0)
        {
            return NotFound(new
            {
                mensagem = "Não há medicamentos cadastrados ainda."
            });
        }


        return Ok(medicamentos);
    }

    // GET: api/usuarios/1/medicamentos/1
    [HttpGet("{id}")]
    public async Task<ActionResult<Medicamento>> GetMedicamentoPorID(int usuarioId, int id)
    {

        if (!usuarioTemAcesso(usuarioId))
        {
            return Forbid();
        }


        var medicamento = await _context.medicamentos.FirstOrDefaultAsync(m =>
                m.Id == id &&
                m.UsuarioId == usuarioId
            );

        if (medicamento == null)
        {
            return NotFound(new
            {
                mensagem = "Medicamento não encontrado."
            });
        }

        return Ok(medicamento);
    }

    // POST: api/usuarios/1/medicamentos
    [HttpPost]
    public async Task<ActionResult<Medicamento>> CriarMedicamento(
        int usuarioId,
        criarMedicamento dto)
    {

        if (!usuarioTemAcesso(usuarioId))
        {
            return Forbid();
        }

        var usuarioExiste = await _context.usuarios
        .AnyAsync(u => u.Id == usuarioId);


        if (!usuarioExiste)
        {
            return NotFound(new
            {
                mensagem = "Usuário não encontrado."
            });
        }

        if (dto.InicioTratamento > dto.FimTratamento)
        {
            return BadRequest(new
            {
                mensagem = "A data de início não pode ser posterior à data de fim."
            });
        }

        var medicamento = new Medicamento
        {
            UsuarioId = usuarioId,
            nomeMedicamento = dto.nomeMedicamento,
            dosagem = dto.dosagem,
            frequencia = dto.frequencia,
            descricao = dto.descricao,
            InicioTratamento = dto.InicioTratamento,
            FimTratamento = dto.FimTratamento
        };

        _context.medicamentos.Add(medicamento);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetMedicamentoPorID),
            new { usuarioId, id = medicamento.Id },
            medicamento
        );
    }

    // PATCH: api/usuarios/1/medicamentos/1
    [HttpPatch("{id}")]
    public async Task<IActionResult> EditarMedicamento(
        int usuarioId,
        int id,
        atualizarMedicamento dto)
    {

        if (!usuarioTemAcesso(usuarioId))
        {
            return Forbid();
        }


        var medicamento = await _context.medicamentos
            .FirstOrDefaultAsync(m =>
                m.Id == id &&
                m.UsuarioId == usuarioId);

        if (medicamento == null)
        {
            return NotFound(new
            {
                mensagem = "Medicamento não encontrado."
            });
        }

        if (dto.nomeMedicamento != null)
        {
            medicamento.nomeMedicamento = dto.nomeMedicamento;
        }

        if (dto.dosagem != null)
        {
            medicamento.dosagem = dto.dosagem;
        }

        if (dto.frequencia != null)
        {
            medicamento.frequencia = dto.frequencia;
        }

        if (dto.descricao != null)
        {
            medicamento.descricao = dto.descricao;
        }

        if (dto.InicioTratamento.HasValue)
        {
            medicamento.InicioTratamento = dto.InicioTratamento.Value;
        }

        if (dto.FimTratamento.HasValue)
        {
            medicamento.FimTratamento = dto.FimTratamento.Value;
        }

        if (medicamento.InicioTratamento > medicamento.FimTratamento)
        {
            return BadRequest(new
            {
                mensagem = "A data de início não pode ser posterior à data de fim."
            });
        }

        await _context.SaveChangesAsync();

        return Ok(medicamento);
    }

    // DELETE: api/usuarios/1/medicamentos/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoverMedicamento(
        int usuarioId,
        int id)
    {

        if (!usuarioTemAcesso(usuarioId))
        {
            return Forbid();
        }


        var medicamento = await _context.medicamentos.FirstOrDefaultAsync(m =>
                m.Id == id &&
                m.UsuarioId == usuarioId);

        if (medicamento == null)
        {
            return NotFound(new
            {
                mensagem = "Medicamento não encontrado."
            });
        }

        _context.medicamentos.Remove(medicamento);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
