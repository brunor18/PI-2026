import { useEffect, useRef, useState } from "react";
import { Bell, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { obterDestinoDaSessao } from "@/lib/session";
import api from "@/services/api.service";

function ConfirmacaoSenha({ proposta, aoCancelar, aoAceitar, aoOcupar }) {
  const [senha, setSenha] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function confirmar(event) {
    event.preventDefault();
    if (salvando || !senha) return;
    setSalvando(true);
    aoOcupar(proposta.id);
    setErro("");

    try {
      const { data } = await api.post(`/api/propostas/${proposta.id}/aceitar`, { senha });
      aoAceitar(proposta.id, data.mensagem);
    } catch (error) {
      setErro(error.response?.status === 429
        ? "Muitas tentativas. Aguarde um minuto antes de tentar novamente."
        : error.response?.data?.mensagem || "Não foi possível aceitar a proposta. Tente novamente.");
    } finally {
      setSenha("");
      setSalvando(false);
      aoOcupar(null);
    }
  }

  return (
    <form onSubmit={confirmar} className="mt-5 border-t border-border pt-5" aria-busy={salvando}>
      <label htmlFor="senha-aceite-proposta" className="block text-sm font-semibold text-primary">
        Confirme sua identidade com a senha da conta
      </label>
      <p id="ajuda-senha-proposta" className="mt-2 text-sm leading-6 text-muted-foreground">
        Digite sua senha, não o PIN. Após confirmar, este cuidador será vinculado à sua conta e poderá consultar seus registros de saúde.
      </p>
      <div className="relative mt-3">
        <input
          id="senha-aceite-proposta"
          name="senha"
          type={mostrar ? "text" : "password"}
          autoComplete="current-password"
          autoFocus
          required
          maxLength={256}
          disabled={salvando}
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          aria-describedby="ajuda-senha-proposta"
          className="min-h-12 w-full rounded-lg border border-input bg-card py-3 pl-4 pr-14 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={salvando}
          aria-label={mostrar ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={mostrar}
          onClick={() => setMostrar((atual) => !atual)}
          className="absolute inset-y-0 right-1 my-auto size-11"
        >
          {mostrar ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </Button>
      </div>
      {erro && <p role="alert" className="mt-3 text-sm text-destructive">{erro}</p>}
      <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" disabled={salvando} onClick={aoCancelar} className="min-h-12">
          Cancelar
        </Button>
        <Button type="submit" disabled={salvando || !senha} className="min-h-12">
          <Check aria-hidden="true" />
          {salvando ? "Confirmando..." : "Confirmar aceite com senha"}
        </Button>
      </div>
    </form>
  );
}

export function NotificacoesClient() {
  const [aberto, setAberto] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [selecionada, setSelecionada] = useState(null);
  const [ocupada, setOcupada] = useState(null);
  const [tentativa, setTentativa] = useState(0);
  const [agora, setAgora] = useState(Date.now);
  const consumidas = useRef(new Set());
  const ativo = obterDestinoDaSessao() === "/HomeClient";

  useEffect(() => {
    if (!ativo) return;
    const controller = new AbortController();
    let emCurso = false;

    async function carregar() {
      if (emCurso) return;
      emCurso = true;
      try {
        const { data } = await api.get("/api/propostas/notificacoes", { signal: controller.signal });
        if (!Array.isArray(data)) throw new Error("Resposta inválida da API.");
        if (!controller.signal.aborted) {
          setNotificacoes(data.filter((proposta) => !consumidas.current.has(proposta.id)));
          setErro("");
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setErro(error.response?.status === 401
            ? "Sua sessão expirou. Entre novamente."
            : "Não foi possível atualizar as notificações.");
        }
      } finally {
        emCurso = false;
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    carregar();
    const intervalo = window.setInterval(carregar, 15000);
    const relogio = window.setInterval(() => setAgora(Date.now()), 1000);
    window.addEventListener("focus", carregar);

    return () => {
      controller.abort();
      window.clearInterval(intervalo);
      window.clearInterval(relogio);
      window.removeEventListener("focus", carregar);
    };
  }, [ativo, tentativa]);

  if (!ativo) return null;
  const pendentes = notificacoes.filter((proposta) => new Date(proposta.expiraEm).getTime() > agora);

  function remover(id) {
    consumidas.current.add(id);
    setNotificacoes((atuais) => atuais.filter((proposta) => proposta.id !== id));
    setSelecionada(null);
  }

  async function recusar(id) {
    if (ocupada) return;
    setOcupada(id);
    setAviso("");
    try {
      await api.delete(`/api/propostas/${id}`);
      remover(id);
      setAviso("Proposta recusada.");
    } catch (error) {
      if (error.response?.status === 404) remover(id);
      setErro(error.response?.data?.mensagem || "Não foi possível recusar a proposta.");
    } finally {
      setOcupada(null);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="relative size-11 shrink-0 px-0 shadow-none"
        aria-label={`Notificações: ${pendentes.length} propostas pendentes`}
        aria-haspopup="dialog"
        title="Notificações"
        onClick={() => { setAberto(true); setTentativa((atual) => atual + 1); }}
      >
        <Bell aria-hidden="true" className="size-5" />
        {pendentes.length > 0 && (
          <span aria-hidden="true" className="absolute -right-2 -top-2 rounded-full bg-emergency px-1.5 py-0.5 text-xs font-semibold text-emergency-foreground">
            {pendentes.length > 99 ? "99+" : pendentes.length}
          </span>
        )}
      </Button>
      <span role="status" className="sr-only">
        {pendentes.length > 0 ? `Você possui ${pendentes.length} propostas de serviço pendentes.` : ""}
      </span>
      {aberto && (
        <Modal
          titulo="Notificações de propostas"
          bloqueado={Boolean(ocupada)}
          aoFechar={() => { setAberto(false); setSelecionada(null); setAviso(""); }}
        >
          <p className="mb-5 text-sm leading-6 text-muted-foreground">
            As propostas expiram uma hora após o envio. Esta lista é atualizada automaticamente.
          </p>
          {aviso && <p role="status" className="mb-4 rounded-lg bg-success-soft p-4 text-sm text-success">{aviso}</p>}
          {erro && (
            <div className="mb-4">
              <p role="alert" className="text-sm text-destructive">{erro}</p>
              <Button type="button" variant="outline" disabled={Boolean(ocupada)} onClick={() => setTentativa((atual) => atual + 1)} className="mt-3">
                Tentar novamente
              </Button>
            </div>
          )}
          {carregando ? (
            <p role="status" className="py-8 text-center text-muted-foreground">Carregando propostas...</p>
          ) : pendentes.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">Nenhuma proposta pendente.</p>
          ) : (
            <div className="space-y-5">
              {pendentes.map((proposta) => (
                <article key={proposta.id} className="min-w-0 rounded-lg border border-border bg-background p-4 sm:p-5">
                  <h3 className="break-words font-heading text-xl font-semibold text-primary">{proposta.cuidador.nome}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Proposta de serviço · Expira às {new Date(proposta.expiraEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7">{proposta.mensagem}</p>
                  {selecionada === proposta.id ? (
                    <ConfirmacaoSenha
                      proposta={proposta}
                      aoCancelar={() => setSelecionada(null)}
                      aoOcupar={setOcupada}
                      aoAceitar={(id, mensagem) => {
                        remover(id);
                        setAviso(mensagem);
                        window.dispatchEvent(new Event("vinculo-cuidador-atualizado"));
                      }}
                    />
                  ) : (
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <Button type="button" disabled={Boolean(ocupada)} onClick={() => { setAviso(""); setSelecionada(proposta.id); }} className="min-h-12 sm:flex-1">
                        Aceitar proposta
                      </Button>
                      <Button type="button" variant="outline" disabled={Boolean(ocupada)} onClick={() => recusar(proposta.id)} className="min-h-12 sm:flex-1">
                        Recusar
                      </Button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
