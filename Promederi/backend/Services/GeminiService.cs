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
            try
            {
                var response = await _client.Models.GenerateContentAsync(
                    model: "gemini-3.8-flash",
                    contents: mensagemUsuario
                );

                return response.Text ?? "Sem resposta do modelo.";
            }
            catch (ServerError)
            {
                var fallbackResponse = await _client.Models.GenerateContentAsync(
                    model: "gemini-3.5-flash-lite",
                    contents: mensagemUsuario
                );

                return fallbackResponse.Text ?? "Sem resposta do modelo.";
            }
        }
    }
}