import { useEffect, useState } from "react";
import { Bot, ClipboardList, Send, ShieldAlert, Stethoscope, UserRound } from "lucide-react";
import { NavBarClient } from "@/components/NavBarClient";
import { Button } from "@/components/ui/button";
import api from "@/services/api.service";
import { PageIntro } from "./CuidadoresClient";

const quickReports = [
  "Tontura",
  "Náusea",
  "Dor de cabeça",
];

export function IAClient() {
  const [perfil, setPerfil] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      autor: "bot",
      texto: "Olá! Conte o que você percebeu hoje e informe horário, intensidade e se já aconteceu antes."
    }
  ]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    api.get("/api/clientes/me").then(({ data }) => setPerfil(data)).catch(() => setPerfil(null));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message;
    setMessage("");
    
    // Adiciona a mensagem do usuário ao histórico e exibe estado de carregamento
    setChatHistory((prev) => [...prev, { autor: "usuario", texto: userMessage }]);
    setLoading(true);

    try {
      const { data } = await api.post("/api/chat/mensagem", { mensagem: userMessage });

      setChatHistory((prev) => [
        ...prev,
        { autor: "bot", texto: data.resposta }
      ]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          autor: "bot",
          texto: error.response?.data?.mensagem ||
            error.response?.data ||
            "Desculpe, ocorreu um erro ao conectar com o assistente de saúde. Tente novamente mais tarde.",
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const chooseReport = (report) => {
    setMessage(report);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBarClient />
      <PageIntro
        eyebrow="Orientação inicial"
        title="IA de saúde"
        text="Descreva uma alteração percebida e receba uma orientação inicial baseada no histórico de Helena."
      />

      <main className="mx-auto grid max-w-7xl items-start gap-6 px-5 pb-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
        <section className="rounded-lg border border-border bg-card p-5 shadow-soft sm:p-7">
          <div className="grid gap-5 border-b border-border pb-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-semibold text-emergency">
                <Stethoscope className="size-4" /> Assistente Promedéri
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold text-primary">Relato de sintomas</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Escreva de forma simples o que mudou. A resposta organiza o risco, possíveis causas e próximos cuidados.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-background px-4 py-3">
              <UserRound className="size-5 text-emergency" />
              <div>
                <p className="text-sm font-semibold text-primary">{perfil?.nome || "Meu perfil"}</p>
                <p className="text-xs text-muted-foreground">{perfil?.idade ? `${perfil.idade} anos` : "Perfil"} • histórico ativo</p>
              </div>
            </div>
          </div>

          {/* Histórico do Chat dinâmico */}
          <div className="mt-6 space-y-5">
            {chatHistory.map((item, index) => (
              <div 
                key={index} 
                className={`flex gap-3 ${item.autor === "usuario" ? "justify-end" : "grid grid-cols-[auto_minmax(0,1fr)]"}`}
              >
                {item.autor === "bot" && (
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-primary">
                    <Bot className="size-5" />
                  </span>
                )}
                <div className={`rounded-lg p-4 text-sm leading-6 ${item.autor === "usuario" ? "bg-muted text-primary max-w-2xl" : "bg-background text-foreground w-full"}`}>
                  {item.autor === "usuario" && <p className="font-semibold">Relato enviado</p>}
                  <p className={item.autor === "usuario" ? "mt-1 whitespace-pre-wrap" : "whitespace-pre-wrap"}>
                    {item.texto}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 animate-pulse">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-primary">
                  <Bot className="size-5" />
                </span>
                <p className="rounded-lg bg-background p-4 text-sm leading-6 text-muted-foreground">
                  Analisando relato com o histórico de saúde...
                </p>
              </div>
            )}
          </div>

          {/* Relatos Rápidos */}
          <div className="mt-7">
            <p className="text-sm font-semibold text-primary">Relatos rápidos</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickReports.map((report) => (
                <Button
                  key={report}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => chooseReport(report)}
                >
                  {report}
                </Button>
              ))}
            </div>
          </div>

          {/* Formulário de Envio */}
          <form onSubmit={submit} className="mt-6">
            <label className="block text-sm font-medium text-foreground">
              Descreva o sintoma
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ex.: senti tontura ao me levantar por volta das 10h..."
                className="mt-2 min-h-32 w-full resize-none rounded-lg border border-input bg-background p-4 text-sm outline-hidden focus:border-primary focus:ring-3 focus:ring-primary/15"
              />
            </label>
            <Button
              type="submit"
              disabled={!message.trim() || loading}
              className="mt-3 min-h-12 sm:ml-auto sm:flex"
            >
              <Send className="size-4" /> {loading ? "Analisando..." : "Analisar relato"}
            </Button>
          </form>
        </section>

        {/* Barra Lateral de Avisos */}
        <aside className="space-y-5">
          <section className="rounded-lg bg-primary p-6 text-primary-foreground shadow-brand">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 size-5 shrink-0 text-highlight" />
              <p className="text-sm leading-6 text-primary-foreground/80">
                As respostas não substituem diagnóstico ou prescrição de um profissional de saúde. Em caso de risco imediato, procure atendimento.
              </p>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <ClipboardList className="size-4 text-emergency" /> Como utilizar o relato de sintomas. Informe:
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>O que você sente ou sentiu.</li>
              <li>Intensidade e duração.</li>
              <li>Medicamentos, alimentação e atividades recentes.</li>
            </ul>
          </section>
        </aside>
      </main>
    </div>
  );
}