using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTO;
using backend.Models;




namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(
            AppDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: api/Auth/cadastro
        [HttpPost("cadastro")]
        public async Task<IActionResult> Cadastro(cadastrarUsuario dto)
        {
            var emailExiste = await _context.Usuarios
                .AnyAsync(u => u.email == dto.email);

            if (emailExiste)
            {
                return Conflict(new
                {
                    mensagem = "Este e-mail já está cadastrado."
                });
            }

            var senhaHash = BCrypt.Net.BCrypt.HashPassword(dto.senha);

            var usuario = new Usuario
            {
                nome = dto.nome,
                email = dto.email,
                senha = senhaHash,
                PIN = dto.PIN,
                numeroTelefone = dto.numeroTelefone
            };

            _context.Usuarios.Add(usuario);

            await _context.SaveChangesAsync();

            return StatusCode(201, new
            {
                mensagem = "Usuário cadastrado com sucesso.",
                usuarioId = usuario.Id
            });
        }
    }
}