using backend.Services;
using Google.GenAI;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly GeminiService _geminiService;

        public ChatController(GeminiService geminiService)
        {
            _geminiService = geminiService;
        }

        [HttpPost("mensagem")]
        public async Task<IActionResult> EnviarMensagem([FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Mensagem))
                return BadRequest("A mensagem não pode estar vazia.");

            try
            {
                var resposta = await _geminiService.ObterRespostaAsync(request.Mensagem);
                return Ok(new { resposta });
            }
            catch (ServerError)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, new
                {
                    mensagem = "O assistente está temporariamente ocupado. Tente enviar o relato novamente em alguns instantes.",
                });
            }
        }
    }

    public class ChatRequest
    {
        public string Mensagem { get; set; } = string.Empty;
    }
}