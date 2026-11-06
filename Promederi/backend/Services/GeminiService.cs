using Google.GenAI;

namespace backend.Services
{
    public class GeminiService
    {
        private readonly Client _client;

        public GeminiService(IConfiguration configuration)
        {
            var apiKey = configuration["Gemini:ApiKey"];
            _client = new Client(apiKey: apiKey);
        }

        public async Task<string> ObterRespostaAsync(string mensagemUsuario)
        {
            var response = await _client.Models.GenerateContentAsync(
                model: "gemini-2.5-flash",
                contents: mensagemUsuario
            );

            return response.Text ?? "Sem resposta do modelo.";
        }
    }
}