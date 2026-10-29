import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { MapPin, RotateCcw, Search, Users, X } from "lucide-react";
import { NavBarClient } from "@/components/navbarClient";
import { Button } from "@/components/ui/button";
import api from "@/services/api.service";
import { obterDestinoDaSessao } from "@/lib/session";
import { obterLinkWhatsApp, resumirDescricao } from "@/lib/cuidadores";
import { BotaoContato } from "@/components/BotaoContato";

function normalizar(valor) {
  return String(valor ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
}

function DetalhesCuidador({ cuidador, aoFechar }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflowAnterior;
    };
  }, []);

  function fecharPeloFundo(event) {
    if (event.target !== event.currentTarget) return;
    const { left, right, top, bottom } = event.currentTarget.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) aoFechar();
  }

  return (
    <dialog ref={dialogRef} onClose={(event) => { if (!event.currentTarget.open) aoFechar(); }} onClick={fecharPeloFundo} aria-labelledby="detalhes-cuidador-titulo" className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-lg border border-border bg-card p-0 text-foreground shadow-modal backdrop:bg-overlay">
      <div className="p-5 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0"><p className="text-sm font-semibold text-emergency">Perfil do cuidador</p><h2 id="detalhes-cuidador-titulo" className="mt-2 break-words font-heading text-3xl font-semibold text-primary">{cuidador.nome}</h2></div>
          <Button type="button" variant="ghost" size="icon" onClick={aoFechar} aria-label="Fechar detalhes" className="size-11 shrink-0"><X aria-hidden="true" /></Button>
        </div>
        <dl className="mt-6 grid gap-5 border-y border-border py-5 sm:grid-cols-2">
          <div><dt className="text-sm font-semibold text-primary">Idade</dt><dd className="mt-1 text-sm text-muted-foreground">{cuidador.idade != null ? `${cuidador.idade} anos` : "Não informada"}</dd></div>
          <div><dt className="text-sm font-semibold text-primary">Idosos atendidos</dt><dd className="mt-1 text-sm text-muted-foreground">{cuidador.idososAtendidos}</dd></div>
          <div className="sm:col-span-2"><dt className="text-sm font-semibold text-primary">Endereço</dt><dd className="mt-1 break-words text-sm text-muted-foreground">{[cuidador.endereco, cuidador.numero].filter(Boolean).join(", ") || "Não informado"}</dd></div>
        </dl>
        {cuidador.atendeVoce && <p className="mt-5 text-sm font-semibold text-success">Faz parte da sua rede de cuidado</p>}
        <h3 className="mt-6 font-heading text-xl font-semibold text-primary">Sobre o cuidador</h3>
        <p className="mt-3 whitespace-pre-wrap break-words text-base leading-8">{cuidador.descricao || "Este cuidador ainda não adicionou uma descrição."}</p>
        <div className="mt-8 border-t border-border pt-5"><BotaoContato telefone={cuidador.numeroTelefone} />{!obterLinkWhatsApp(cuidador.numeroTelefone) && <p className="mt-2 text-sm text-muted-foreground">O cuidador ainda não possui um telefone válido para contato.</p>}</div>
      </div>
    </dialog>
  );
}

export function CuidadoresClient() {
  const [cuidadores, setCuidadores] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);
  const [cuidadorSelecionado, setCuidadorSelecionado] = useState(null);
  const destino = obterDestinoDaSessao();

  useEffect(() => {
    if (destino !== "/HomeClient") return;
    const controller = new AbortController();

    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const { data } = await api.get("/api/cuidadores", { signal: controller.signal });
        if (!Array.isArray(data)) throw new Error("Resposta inválida da API.");
        if (!controller.signal.aborted) {
          setCuidadores(data.filter((cuidador) => cuidador && cuidador.id && cuidador.usuarioId));
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setErro(error.response?.status === 401
            ? "Sua sessão não foi aceita. Saia da conta e entre novamente."
            : "Não foi possível carregar os cuidadores. Tente novamente.");
        }
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    carregar();
    return () => controller.abort();
  }, [destino, tentativa]);

  useEffect(() => {
    const atualizar = () => setTentativa((atual) => atual + 1);
    window.addEventListener("vinculo-cuidador-atualizado", atualizar);
    return () => window.removeEventListener("vinculo-cuidador-atualizado", atualizar);
  }, []);

  if (!destino) return <Navigate to="/login" replace />;
  if (destino !== "/HomeClient") return <Navigate to={destino} replace />;

  const visiveis = cuidadores.filter((cuidador) => normalizar([cuidador.nome, cuidador.endereco, cuidador.numero, cuidador.descricao].join(" ")).includes(normalizar(busca)));

  return (
    <div className="min-h-screen bg-background">
      <NavBarClient />
      <PageIntro eyebrow="Rede de cuidado" title="Meus Cuidadores" text="Conheça os perfis dos cuidadores cadastrados, sua experiência e os cuidados que oferecem." />
      <main className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
        <section aria-label="Lista de cuidadores" aria-busy={carregando} className="rounded-lg border border-border bg-card p-5 shadow-soft sm:p-7">
          <label className="flex min-h-12 items-center gap-3 rounded-lg border border-input bg-background px-4 focus-within:ring-2 focus-within:ring-primary">
            <Search aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
            <span className="sr-only">Buscar cuidadores por nome, endereço ou descrição</span>
            <input type="search" value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar por nome, endereço ou descrição" className="min-w-0 w-full bg-transparent py-3 text-base outline-none" />
          </label>

          {carregando ? (
            <p role="status" className="py-10 text-center text-muted-foreground">Carregando cuidadores...</p>
          ) : erro ? (
            <div className="mt-6 rounded-lg border border-border bg-background p-6 text-center">
              <p role="alert" className="text-destructive">{erro}</p>
              <Button type="button" variant="outline" onClick={() => setTentativa((atual) => atual + 1)} className="mt-4 min-h-12"><RotateCcw aria-hidden="true" /> Tentar novamente</Button>
            </div>
          ) : cuidadores.length === 0 ? (
            <div role="status" className="py-12 text-center">
              <Users aria-hidden="true" className="mx-auto size-10 text-primary" />
              <h2 className="mt-4 font-heading text-2xl font-semibold text-primary">Nenhum cuidador cadastrado</h2>
              <p className="mt-2 text-muted-foreground">Ainda não há usuários cadastrados como cuidadores na plataforma.</p>
            </div>
          ) : visiveis.length === 0 ? (
            <p role="status" className="py-10 text-center text-muted-foreground">Nenhum cuidador encontrado para essa busca. Tente outro nome.</p>
          ) : (
            <>
              <p role="status" className="mt-5 text-sm text-muted-foreground">{visiveis.length} {visiveis.length === 1 ? "cuidador encontrado" : "cuidadores encontrados"}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visiveis.map((cuidador) => (
                  <article key={cuidador.id} className="flex min-w-0 flex-col rounded-lg border border-border bg-background p-5">
                    <div className="flex items-center gap-4">
                      <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary font-heading text-xl font-semibold text-primary">{Array.from(cuidador.nome || "C")[0].toLocaleUpperCase("pt-BR")}</span>
                      <div className="min-w-0"><h2 className="break-words font-heading text-xl font-semibold text-primary">{cuidador.nome}</h2><p className="mt-1 text-sm text-muted-foreground">{cuidador.idade != null ? `${cuidador.idade} anos` : "Idade não informada"}</p></div>
                    </div>
                    {cuidador.atendeVoce && <p className="mt-4 self-start rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">Faz parte da sua rede de cuidado</p>}
                    <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-muted-foreground"><MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" /><span className="break-words">{[cuidador.endereco, cuidador.numero].filter(Boolean).join(", ") || "Endereço não informado"}</span></p>
                    <p className="mt-4 flex-1 whitespace-pre-wrap break-words text-sm leading-7 text-foreground">{resumirDescricao(cuidador.descricao)}</p>
                    <p className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-sm font-medium text-primary"><Users aria-hidden="true" className="size-4 shrink-0" />{cuidador.idososAtendidos === 1 ? "1 idoso atendido" : `${cuidador.idososAtendidos} idosos atendidos`}</p>
                    <div className="mt-5 grid gap-3">
                      <Button type="button" variant="outline" onClick={() => setCuidadorSelecionado(cuidador)} aria-haspopup="dialog" aria-label={`Mais detalhes de ${cuidador.nome}`} className="min-h-12 w-full">Mais detalhes</Button>
                      <BotaoContato telefone={cuidador.numeroTelefone} />
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      {cuidadorSelecionado && <DetalhesCuidador cuidador={cuidadorSelecionado} aoFechar={() => setCuidadorSelecionado(null)} />}
    </div>
  );
}

export function PageIntro({ eyebrow, title, text }) {
  return <header className="mx-auto max-w-7xl px-5 pb-8 pt-10 lg:px-8"><p className="text-sm font-semibold text-emergency">{eyebrow}</p><h1 className="mt-2 font-heading text-4xl font-semibold text-primary sm:text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-muted-foreground">{text}</p></header>;
}
