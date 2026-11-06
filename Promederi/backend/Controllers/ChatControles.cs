using backend.Services;
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

            var resposta = await _geminiService.ObterRespostaAsync(request.Mensagem);
            return Ok(new { resposta });
        }
    }

    public class ChatRequest
    {
        public string Mensagem { get; set; } = string.Empty;
    }
}