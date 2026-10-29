import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import api from "@/services/api.service";

export function PropostaServicoModal({ cliente, aoFechar, aoEnviar }) {
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  async function confirmar(event) {
    event.preventDefault();
    if (enviando || !mensagem.trim()) return;
    setEnviando(true);
    setErro("");

    try {
      const { data } = await api.post("/api/propostas", {
        clienteId: cliente.id,
        mensagem: mensagem.trim(),
      });
      aoEnviar(data);
    } catch (error) {
      setErro(error.response?.status === 429
        ? "Muitas tentativas. Aguarde um minuto e tente novamente."
        : error.response?.data?.mensagem || "Não foi possível enviar a proposta. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal titulo={`Proposta para ${cliente.nome}`} aoFechar={aoFechar} bloqueado={enviando}>
      <form onSubmit={confirmar} aria-busy={enviando}>
        <label htmlFor="mensagem-proposta" className="block text-base font-medium leading-7 text-primary">
          Descreva um pouco sobre o porquê você deveria ser o cuidador desse cliente:
        </label>
        <textarea
          id="mensagem-proposta"
          name="mensagem"
          value={mensagem}
          onChange={(event) => setMensagem(event.target.value)}
          required
          autoFocus
          maxLength={2000}
          disabled={enviando}
          placeholder="Conte sobre sua experiência e como pode ajudar este cliente."
          className="mt-3 min-h-40 w-full resize-y rounded-lg border border-input bg-background p-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          A proposta fica disponível para o cliente por uma hora.
        </p>
        {erro && <p role="alert" className="mt-4 text-sm text-destructive">{erro}</p>}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" disabled={enviando} onClick={aoFechar} className="min-h-12">
            Cancelar
          </Button>
          <Button type="submit" disabled={enviando || !mensagem.trim()} className="min-h-12">
            <Send aria-hidden="true" />
            {enviando ? "Enviando..." : "Confirmar proposta"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
