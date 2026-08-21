using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTO;
using backend.Models;

namespace Promederi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicamentosController : ControllerBase
{
    private readonly AppDbContext _context;

    public MedicamentosController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Medicamentos
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Medicamento>>> GetMedicamentos()
    {
        var medicamentos = await _context.Medicamentos.ToListAsync();

        if(medicamentos.Count == 0)
        {
            return NotFound(new
            {
                mensagem = "Não há medicamentos cadastrados ainda."
            });
        }

        return Ok(medicamentos);
    }

    // GET: api/Medicamentos/1
    [HttpGet("{id}")]
    public async Task<ActionResult<Medicamento>> GetMedicamentoPorID(int id)
    {
        var medicamento = await _context.Medicamentos.FindAsync(id);

        if (medicamento == null)
        {
            return NotFound(new
            {
                mensagem = "Medicamento não encontrado."
            });
        }

        return Ok(medicamento);
    }

    // POST: api/Medicamentos
    [HttpPost]
    public async Task<ActionResult<Medicamento>> CriarMedicamento(
        criarMedicamento dto)
    {
        if (dto.InicioTratamento > dto.FimTratamento)
        {
            return BadRequest(new
            {
                mensagem = "A data de início não pode ser posterior à data de fim."
            });
        }

        var medicamento = new Medicamento
        {
            nomeMedicamento = dto.nomeMedicamento,
            dosagem = dto.dosagem,
            frequencia = dto.frequencia,
            InicioTratamento = dto.InicioTratamento,
            FimTratamento = dto.FimTratamento
        };

        _context.Medicamentos.Add(medicamento);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetMedicamentoPorID),
            new { id = medicamento.Id },
            medicamento
        );
    }

    // PUT: api/Medicamentos/1
    [HttpPut("{id}")]
    public async Task<IActionResult> EditarMedicamento(
        int id,
        atualizarMedicamento dto)
    {
        var medicamento = await _context.Medicamentos.FindAsync(id);

        if (medicamento == null)
        {
            return NotFound(new
            {
                mensagem = "Medicamento não encontrado."
            });
        }

        if (dto.InicioTratamento > dto.FimTratamento)
        {
            return BadRequest(new
            {
                mensagem = "A data de início não pode ser posterior à data de fim."
            });
        }

        medicamento.nomeMedicamento = dto.nomeMedicamento;
        medicamento.dosagem = dto.dosagem;
        medicamento.frequencia = dto.frequencia;
        medicamento.InicioTratamento = dto.InicioTratamento;
        medicamento.FimTratamento = dto.FimTratamento;

        await _context.SaveChangesAsync();

        return Ok(medicamento);
    }

    // DELETE: api/Medicamentos/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoverMedicamento(int id)
    {
        var medicamento = await _context.Medicamentos.FindAsync(id);

        if (medicamento == null)
        {
            return NotFound(new
            {
                mensagem = "Medicamento não encontrado."
            });
        }

        _context.Medicamentos.Remove(medicamento);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}