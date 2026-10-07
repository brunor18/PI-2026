using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using backend.Data;
using backend.DTO;
using backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace Promederi.Controllers
{
    [ApiController]
    [Route("api/auth")]
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

        // POST: api/auth/cadastro
        [HttpPost("cadastro")]
        public async Task<IActionResult> Cadastro(cadastrarUsuario dto)
        {
            var email = dto.email.Trim().ToLower();

            var emailExiste = await _context.usuarios
                .AnyAsync(u => u.email == email);

            if (emailExiste)
            {
                return Conflict(new
                {
                    mensagem = "Este e-mail já está cadastrado."
                });
            }

            var senhaHash = BCrypt.Net.BCrypt.HashPassword(dto.senha);
            var pinHash = BCrypt.Net.BCrypt.HashPassword(dto.PIN);

            var usuario = new Usuario
            {
                nome = dto.nome.Trim(),
                email = email,


                senha = senhaHash,


                PIN = pinHash,

                numeroTelefone = dto.numeroTelefone.Trim(),

                TipoUsuario = (TipoUsuario)dto.tipoUsuario,

                IdosoId = null, 

                UltimaAutenticacaoSenha = null
            };

            _context.usuarios.Add(usuario);

            await _context.SaveChangesAsync();

            return StatusCode(201, new
            {
                mensagem = "Usuário cadastrado com sucesso.",
                usuarioId = usuario.Id
            });
        }

        // POST: api/auth/login
        // Login utilizando e-mail + PIN
        [HttpPost("login")]
        public async Task<IActionResult> Login(loginUsuario dto)
        {
            var email = dto.email.Trim().ToLower();

            var usuario = await _context.usuarios
                .FirstOrDefaultAsync(u => u.email == email);

            // Não informamos se o problema foi o e-mail
            // ou o PIN.
            if (usuario == null)
            {
                return Unauthorized(new
                {
                    mensagem = "E-mail ou PIN inválidos."
                });
            }

            var pinValido =
                VerificarCredencial(
                    dto.PIN,
                    usuario.PIN
                );

            if (!pinValido)
            {
                return Unauthorized(new
                {
                    mensagem = "E-mail ou PIN inválidos."
                });
            }

            // Verifica os 15 dias
            if (PrecisaAutenticacaoPorSenha(usuario))
            {
                // Cria um token TEMPORÁRIO.
                var tokenTemporario =
                    GerarToken(
                        usuario,
                        "password_confirmation"
                    );

                return Ok(new
                {
                    mensagem =
                        "É necessário confirmar sua senha.",

                    requerSenha = true,

                    tokenTemporario = tokenTemporario
                });
            }

            // Os 15 dias ainda estão válidos.
            var token =
                GerarToken(
                    usuario,
                    "access"
                );

            return Ok(new
            {
                mensagem =
                    "Login realizado com sucesso.",

                requerSenha = false,

                token = token,

                usuario = new
                {
                    id = usuario.Id,
                    nome = usuario.nome,
                    email = usuario.email,
                    tipoUsuario = usuario.TipoUsuario,
                    idosoId = usuario.IdosoId
                }
            });
        }

        // POST: api/auth/confirmar-senha
        // Utilizado quando os 15 dias expiraram
        [Authorize]
        [HttpPost("confirmar-senha")]
        public async Task<IActionResult> ConfirmarSenha(
            confirmarSenha dto)
        {
            // Verifica se o token é realmente
            // um token temporário.
            var tipoToken =
                User.FindFirst("token_type")?.Value;

            if (tipoToken != "password_confirmation")
            {
                return Forbid();
            }

            // Pega o ID diretamente do JWT.
            var usuarioIdString =
                User.FindFirst(
                    ClaimTypes.NameIdentifier
                )?.Value;

            if (!int.TryParse(
                usuarioIdString,
                out var usuarioId))
            {
                return Unauthorized(new
                {
                    mensagem = "Token inválido."
                });
            }

            var usuario =
                await _context.usuarios
                    .FirstOrDefaultAsync(
                        u => u.Id == usuarioId
                    );

            if (usuario == null)
            {
                return Unauthorized(new
                {
                    mensagem = "Usuário não encontrado."
                });
            }

            // Verifica a senha usando o hash.
            var senhaValida =
                VerificarCredencial(
                    dto.senha,
                    usuario.senha
                );

            if (!senhaValida)
            {
                return Unauthorized(new
                {
                    mensagem = "Senha inválida."
                });
            }

            // Renovamos os 15 dias.
            usuario.UltimaAutenticacaoSenha =
                DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var novoToken =
                GerarToken(
                    usuario,
                    "access"
                );

            return Ok(new
            {
                mensagem =
                    "Senha confirmada com sucesso.",

                requerSenha = false,

                token = novoToken,

                usuario = new
                {
                    id = usuario.Id,
                    nome = usuario.nome,
                    email = usuario.email
                }
            });
        }

        // Um hash inválido deve rejeitar a autenticação, sem gerar erro 500.
        private static bool VerificarCredencial(string valor, string? hash)
        {
            if (string.IsNullOrWhiteSpace(hash))
            {
                return false;
            }

            try
            {
                return BCrypt.Net.BCrypt.Verify(valor, hash);
            }
            catch (SaltParseException)
            {
                return false;
            }
        }

        // verifica se precisa da senha

        private bool PrecisaAutenticacaoPorSenha(
            Usuario usuario)
        {
            // Nunca confirmou a senha.
            if (!usuario.UltimaAutenticacaoSenha.HasValue)
            {
                return true;
            }

            var limite =
                usuario.UltimaAutenticacaoSenha.Value
                    .AddDays(15);

            return DateTime.UtcNow >= limite;
        }


        //geracao jwt

        private string GerarToken(
            Usuario usuario,
            string tipoToken)
        {
            var jwtKey =
                _configuration["Jwt:Key"];

            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException(
                    "JWT Key não configurada."
                );
            }

            var issuer =
                _configuration["Jwt:Issuer"];

            var audience =
                _configuration["Jwt:Audience"];

            var expirationMinutes =
                _configuration.GetValue<int>(
                    "Jwt:ExpirationMinutes"
                );

            var claims = new List<Claim>
            {
                // ID do usuário
                new Claim(
                    ClaimTypes.NameIdentifier,
                    usuario.Id.ToString()
                ),

                // Nome
                new Claim(
                    ClaimTypes.Name,
                    usuario.nome
                ),

                // E-mail
                new Claim(
                    ClaimTypes.Email,
                    usuario.email
                ),

                // Tipo do token
                new Claim(
                    "token_type",
                    tipoToken
                ),
                // Tipo do usuário
                new Claim(
                    "tipo_usuario",
                    usuario.TipoUsuario.ToString()
                )

            };


            if (usuario.IdosoId.HasValue)
            {
                claims.Add(
                    new Claim(
                        "idoso_id",
                        usuario.IdosoId.Value.ToString()
                    )
                );
            }

            var chave =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtKey)
                );

            var credenciais =
                new SigningCredentials(
                    chave,
                    SecurityAlgorithms.HmacSha256
                );

            var token =
                new JwtSecurityToken(
                    issuer: issuer,
                    audience: audience,
                    claims: claims,
                    expires:
                        DateTime.UtcNow.AddMinutes(
                            expirationMinutes
                        ),
                    signingCredentials:
                        credenciais
                );

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }
}
