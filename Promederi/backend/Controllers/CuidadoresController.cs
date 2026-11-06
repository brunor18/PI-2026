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
    [HttpGet("me")]
    public async Task<IActionResult> MeuPerfil(CancellationToken cancellationToken)
    {
        if (!int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var usuarioId))
            return Forbid();
        var perfil = await context.cuidadores.AsNoTracking()
            .Where(c => c.UsuarioId == usuarioId && c.Usuario.TipoUsuario == TipoUsuario.Cuidador)
            .Select(c => new
            {
                id = c.Id, usuarioId = c.UsuarioId, nome = c.Nome, idade = c.Idade,
                numero = c.Numero, endereco = c.Endereco, descricao = c.Descricao,
                funcao = c.Funcao, experiencia = c.Experiencia,
                areaAtendimento = c.AreaAtendimento, especialidades = c.Especialidades,
                email = c.Usuario.email, numeroTelefone = c.Usuario.numeroTelefone,
            }).FirstOrDefaultAsync(cancellationToken);
        return perfil is null ? NotFound(new { mensagem = "Perfil do cuidador não encontrado." }) : Ok(perfil);
    }

    [HttpPut("me")]
    public async Task<IActionResult> AtualizarPerfil([FromBody] PerfilCuidadorDto dto, CancellationToken cancellationToken)
    {
        if (!int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var usuarioId))
            return Forbid();
        var perfil = await context.cuidadores.Include(c => c.Usuario)
            .FirstOrDefaultAsync(c => c.UsuarioId == usuarioId && c.Usuario.TipoUsuario == TipoUsuario.Cuidador, cancellationToken);
        if (perfil is null) return NotFound(new { mensagem = "Perfil do cuidador não encontrado." });
        if (string.IsNullOrWhiteSpace(dto.Nome)) return BadRequest(new { mensagem = "Informe o nome." });
        perfil.Nome = dto.Nome.Trim();
        perfil.Funcao = dto.Funcao?.Trim() ?? "";
        perfil.Experiencia = dto.Experiencia?.Trim() ?? "";
        perfil.AreaAtendimento = dto.AreaAtendimento?.Trim() ?? "";
        perfil.Especialidades = dto.Especialidades?.Trim() ?? "";
        perfil.Descricao = dto.Descricao?.Trim() ?? "";
        perfil.Numero = dto.Numero?.Trim() ?? "";
        perfil.Endereco = dto.Endereco?.Trim() ?? "";
        perfil.Idade = dto.Idade;
        perfil.Usuario.nome = perfil.Nome;
        perfil.Usuario.numeroTelefone = dto.NumeroTelefone?.Trim() ?? perfil.Usuario.numeroTelefone;
        await context.SaveChangesAsync(cancellationToken);
        return await MeuPerfil(cancellationToken);
    }

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
                funcao = c.Funcao,
                experiencia = c.Experiencia,
                areaAtendimento = c.AreaAtendimento,
                especialidades = c.Especialidades,
                idososAtendidos = c.Idosos.Count,
                atendeVoce = c.Idosos.Any(i => i.Id == usuarioId),
            })
            .ToListAsync(cancellationToken);

        return Ok(cuidadores);
    }


    [HttpGet("MeusCuidadores")]
    public async Task<IActionResult> ListarMeus(CancellationToken cancellationToken)
    {
        if (User.FindFirst("token_type")?.Value != "access"
            || !int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var usuarioId))
            return Forbid();

        var cuidadores = await context.cuidadores.AsNoTracking()
            .Where(c => c.Usuario.TipoUsuario == TipoUsuario.Cuidador
                     && c.Idosos.Any(i => i.Id == usuarioId))
            .OrderBy(c => c.Nome).ThenBy(c => c.Id)
            .Select(c => new
            {
                id = c.Id,
                usuarioId = c.UsuarioId,
                numeroTelefone = c.Usuario.numeroTelefone,
                nome = c.Nome,
                idade = c.Idade,
                descricao = c.Descricao,
                funcao = c.Funcao,
                experiencia = c.Experiencia,
                areaAtendimento = c.AreaAtendimento,
                especialidades = c.Especialidades,
            })
            .ToListAsync(cancellationToken);

        return Ok(cuidadores);
    }

    public sealed class PerfilCuidadorDto
    {
        public string Nome { get; set; } = "";
        public int? Idade { get; set; }
        public string? Numero { get; set; }
        public string? Endereco { get; set; }
        public string? NumeroTelefone { get; set; }
        public string? Descricao { get; set; }
        public string? Funcao { get; set; }
        public string? Experiencia { get; set; }
        public string? AreaAtendimento { get; set; }
        public string? Especialidades { get; set; }
    }


}
