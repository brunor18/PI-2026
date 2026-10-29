using System.Security.Claims;
using backend.Data;
using backend.DTO;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Promederi.Controllers;

[Authorize]
[ApiController]
[Route("api/clientes/me")]
public class PerfilClienteController(AppDbContext context) : ControllerBase
{
    private int? UsuarioId() => User.FindFirst("token_type")?.Value == "access"
        && int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var id) ? id : null;

    private static object Resposta(Cliente c) => new
    {
        id = c.Id, usuarioId = c.UsuarioId, nome = c.Nome, idade = c.Idade,
        numeroTelefone = c.NumeroTelefone, endereco = c.Endereco, cidade = c.Cidade,
        peso = c.Peso, altura = c.Altura, descricao = c.Descricao,
        perfilCompleto = c.Idade != null && c.Peso != null && c.Altura != null
            && !string.IsNullOrWhiteSpace(c.Nome) && !string.IsNullOrWhiteSpace(c.NumeroTelefone)
            && !string.IsNullOrWhiteSpace(c.Cidade) && !string.IsNullOrWhiteSpace(c.Endereco) && !string.IsNullOrWhiteSpace(c.Descricao),
    };

    [HttpGet]
    public async Task<IActionResult> Obter(CancellationToken cancellationToken)
    {
        var id = UsuarioId();
        if (id is null || !await context.usuarios.AnyAsync(u => u.Id == id && u.TipoUsuario == TipoUsuario.Idoso, cancellationToken)) return Forbid();
        var perfil = await context.clientes.AsNoTracking().FirstOrDefaultAsync(c => c.UsuarioId == id, cancellationToken);
        return perfil is null ? NotFound(new { mensagem = "Perfil do cliente não encontrado." }) : Ok(Resposta(perfil));
    }

    [HttpPut]
    public async Task<IActionResult> Salvar(SalvarPerfilCliente dto, CancellationToken cancellationToken)
    {
        var id = UsuarioId();
        if (id is null || !await context.usuarios.AnyAsync(u => u.Id == id && u.TipoUsuario == TipoUsuario.Idoso, cancellationToken)) return Forbid();
        var perfil = await context.clientes.Include(c => c.Usuario).FirstOrDefaultAsync(c => c.UsuarioId == id, cancellationToken);
        if (perfil is null) return NotFound(new { mensagem = "Perfil do cliente não encontrado." });

        perfil.Nome = dto.Nome.Trim();
        perfil.Idade = dto.Idade;
        perfil.NumeroTelefone = dto.NumeroTelefone.Trim();
        perfil.Endereco = dto.Endereco.Trim();
        perfil.Cidade = dto.Cidade.Trim();
        perfil.Peso = dto.Peso;
        perfil.Altura = dto.Altura;
        perfil.Descricao = dto.Descricao.Trim();
        perfil.Usuario.nome = perfil.Nome;
        perfil.Usuario.numeroTelefone = perfil.NumeroTelefone;
        await context.SaveChangesAsync(cancellationToken);
        return Ok(Resposta(perfil));
    }
}
