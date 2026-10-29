import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { MapPin, RotateCcw, Search, Users, X } from "lucide-react";
import { NavBarCaregiver } from "@/components/navbarCaregiver";
import { PageIntro } from "../client/CuidadoresClient";
import { Button } from "@/components/ui/button";
import { obterDestinoDaSessao } from "@/lib/session";
import api from "@/services/api.service";
import { BotaoContato } from "@/components/BotaoContato";
import { obterLinkWhatsApp, resumirDescricao } from "@/lib/cuidadores";

function normalizar(valor) {
  return String(valor ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
}

function DetalhesCliente({ cliente, aoFechar }) {
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
    <dialog ref={dialogRef} onClose={(event) => { if (!event.currentTarget.open) aoFechar(); }} onClick={fecharPeloFundo} aria-labelledby="detalhes-cliente-titulo" className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-lg border border-border bg-card p-0 text-foreground shadow-modal backdrop:bg-overlay">
      <div className="p-5 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0"><p className="text-sm font-semibold text-emergency"></p><h2 id="detalhes-cliente-titulo" className="mt-2 break-words font-heading text-3xl font-semibold text-primary">{cliente.nome}</h2></div>
          <Button type="button" variant="ghost" size="icon" onClick={aoFechar} aria-label="Fechar detalhes" className="size-11 shrink-0"><X aria-hidden="true" /></Button>
        </div>
        <dl className="mt-6 grid gap-5 border-y border-border py-5 sm:grid-cols-2">
          <div><dt className="text-sm font-semibold text-primary">Idade</dt><dd className="mt-1 text-sm text-muted-foreground">{cliente.idade != null ? `${cliente.idade} anos` : "Não informada"}</dd></div>
          <div><dt className="text-sm font-semibold text-primary">Telefone</dt><dd className="mt-1 break-words text-sm text-muted-foreground">{cliente.numeroTelefone || "Não informado"}</dd></div>
          <div><dt className="text-sm font-semibold text-primary">Peso</dt><dd className="mt-1 text-sm text-muted-foreground">{cliente.peso != null ? `${cliente.peso} kg` : "Não informado"}</dd></div>
          <div><dt className="text-sm font-semibold text-primary">Altura</dt><dd className="mt-1 text-sm text-muted-foreground">{cliente.altura != null ? `${cliente.altura} cm` : "Não informada"}</dd></div>
          <div className="sm:col-span-2"><dt className="text-sm font-semibold text-primary">Endereço</dt><dd className="mt-1 break-words text-sm text-muted-foreground">{cliente.endereco || "Não informado"}</dd></div>
          <div><dt className="text-sm font-semibold text-primary">Cidade</dt><dd className="mt-1 break-words text-sm text-muted-foreground">{cliente.cidade || "Não informada"}</dd></div>
          <div><dt className="text-sm font-semibold text-primary">Cuidadores vinculados</dt><dd className="mt-1 text-sm text-muted-foreground">{cliente.quantidadeCuidadores}</dd></div>
        </dl>
        {cliente.atendidoPorVoce && <p className="mt-5 text-sm font-semibold text-success">Faz parte dos seus clientes</p>}
        <h3 className="mt-6 font-heading text-xl font-semibold text-primary">Sobre o cliente</h3><p className="mt-3 whitespace-pre-wrap break-words text-base leading-8">{cliente.descricao || "Este cliente ainda não adicionou uma descrição."}</p>
        <div className="mt-8"><BotaoContato telefone={cliente.numeroTelefone} />{!obterLinkWhatsApp(cliente.numeroTelefone) && <p className="mt-2 text-sm text-muted-foreground">Este cliente ainda não possui um telefone válido para contato.</p>}</div>
      </div>
    </dialog>
  );
}

export function PesquisarClientesCaregiver() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const destino = obterDestinoDaSessao();

  useEffect(() => {
    if (destino !== "/HomeCaregiver") return;
    const controller = new AbortController();

    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const { data } = await api.get("/api/clientes", { signal: controller.signal });
        if (!Array.isArray(data)) throw new Error("Resposta inválida da API.");
        if (!controller.signal.aborted) setClientes(data);
      } catch (error) {
        if (!controller.signal.aborted) setErro(error.response?.status === 401
          ? "Sua sessão expirou. Saia da conta e entre novamente."
          : "Não foi possível carregar os clientes. Tente novamente.");
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }
    carregar();
    return () => controller.abort();
  }, [destino, tentativa]);

  if (!destino) return <Navigate to="/login" replace />;
  if (destino !== "/HomeCaregiver") return <Navigate to={destino} replace />;

  const visiveis = clientes.filter((cliente) => normalizar([cliente.nome, cliente.cidade].join(" ")).includes(normalizar(busca)));

  return (
    <div className="min-h-screen bg-background">
      <NavBarCaregiver />
      <PageIntro eyebrow="Rede de cuidado" title="Procurar um cliente" text="Busque por nome ou cidade e encontre idosos com ou sem cuidadores vinculados." />
      <main className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
        <section aria-label="Pesquisa de clientes" aria-busy={carregando} className="rounded-lg border border-border bg-card p-5 shadow-soft sm:p-7">
          <label className="flex min-h-12 items-center gap-3 rounded-lg border border-input bg-background px-4 focus-within:ring-2 focus-within:ring-primary">
            <Search aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
            <span className="sr-only">Buscar clientes por nome ou cidade</span>
            <input type="search" value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar por nome ou cidade" className="min-w-0 w-full bg-transparent py-3 text-base outline-none" />
          </label>
          {carregando ? (
            <p role="status" className="py-10 text-center text-muted-foreground">Carregando clientes...</p>
          ) : erro ? (
            <div className="mt-6 rounded-lg border border-border bg-background p-6 text-center"><p role="alert" className="text-destructive">{erro}</p><Button type="button" variant="outline" onClick={() => setTentativa((atual) => atual + 1)} className="mt-4 min-h-12"><RotateCcw aria-hidden="true" />Tentar novamente</Button></div>
          ) : clientes.length === 0 ? (
            <div role="status" className="py-12 text-center"><Users aria-hidden="true" className="mx-auto size-10 text-primary" /><h2 className="mt-4 font-heading text-2xl font-semibold text-primary">Nenhum cliente cadastrado</h2><p className="mt-2 text-muted-foreground">Ainda não há usuários cadastrados como idosos na plataforma.</p></div>
          ) : visiveis.length === 0 ? (
            <p role="status" className="py-10 text-center text-muted-foreground">Nenhum cliente encontrado para essa busca. Tente outro nome ou cidade.</p>
          ) : (
            <>
              <p role="status" className="mt-5 text-sm text-muted-foreground">{visiveis.length} {visiveis.length === 1 ? "cliente encontrado" : "clientes encontrados"}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visiveis.map((cliente) => (
                  <article key={cliente.id} className="flex min-w-0 flex-col rounded-lg border border-border bg-background p-5">
                    <div className="flex items-center gap-4"><span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary font-heading text-xl font-semibold text-primary">{Array.from(cliente.nome || "C")[0].toLocaleUpperCase("pt-BR")}</span><div className="min-w-0"><h2 className="break-words font-heading text-xl font-semibold text-primary">{cliente.nome}</h2><p className="mt-1 text-sm text-muted-foreground">{cliente.idade != null ? `${cliente.idade} anos` : "Idade não informada"}</p></div></div>
                    <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-muted-foreground"><MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" /><span className="break-words">{cliente.cidade || "Cidade não informada"}</span></p>
                    <p className="mt-4 flex-1 whitespace-pre-wrap break-words text-sm leading-7">{resumirDescricao(cliente.descricao || "Este cliente ainda não adicionou uma descrição.")}</p>
                    <p className={`mt-5 self-start rounded-full px-3 py-1 text-xs font-semibold ${cliente.quantidadeCuidadores > 0 ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>{cliente.quantidadeCuidadores > 0 ? "Já possui cuidador" : "Sem cuidador vinculado"}</p>
                    {cliente.atendidoPorVoce && <p className="mt-3 text-sm font-semibold text-primary">Faz parte dos seus clientes</p>}
                    <p className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-sm text-muted-foreground"><Users aria-hidden="true" className="size-4 shrink-0 text-primary" />{cliente.quantidadeCuidadores === 1 ? "1 cuidador vinculado" : `${cliente.quantidadeCuidadores} cuidadores vinculados`}</p>
                    <div className="mt-5 grid gap-3">
                      <Button type="button" variant="outline" onClick={() => setClienteSelecionado(cliente)} aria-haspopup="dialog" aria-label={`Mais detalhes de ${cliente.nome}`} className="min-h-12 w-full">Mais detalhes</Button>
                      <BotaoContato telefone={cliente.numeroTelefone} />
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      {clienteSelecionado && <DetalhesCliente cliente={clienteSelecionado} aoFechar={() => setClienteSelecionado(null)} />}
    </div>
  );
}
