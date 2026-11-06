import { useEffect, useState } from "react";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import { NavBarClient } from "@/components/navbarClient";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { PageIntro } from "./CuidadoresClient";
import api from "@/services/api.service";

function dataHora(valor) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" }).format(new Date(valor));
}

export function AnotacoesClient() {
  const [anotacoes, setAnotacoes] = useState([]);
  const [busca, setBusca] = useState("");
  const [texto, setTexto] = useState("");
  const [editando, setEditando] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;
    api.get("/api/anotacoes")
      .then(({ data }) => { if (ativo) setAnotacoes(data); })
      .catch(() => { if (ativo) setErro("Não foi possível carregar suas anotações."); });
    return () => { ativo = false; };
  }, []);

  function abrir(anotacao = null) {
    setEditando(anotacao);
    setTexto(anotacao?.texto || "");
    setModalAberto(true);
    setErro("");
  }
  async function salvar(event) {
    event.preventDefault();
    if (!texto.trim()) return;
    setSalvando(true);
    try {
      const { data } = editando
        ? await api.patch(`/api/anotacoes/${editando.id}`, { texto })
        : await api.post("/api/anotacoes", { usuarioId: JSON.parse(sessionStorage.getItem("usuario")).id, texto });
      setAnotacoes((atual) => editando ? atual.map((item) => item.id === data.id ? { ...item, texto: data.texto } : item) : [data, ...atual]);
      setEditando(null); setModalAberto(false); setTexto("");
    } catch (error) { setErro(error.response?.data?.mensagem || "Não foi possível salvar a anotação."); }
    finally { setSalvando(false); }
  }
  async function excluir(id) {
    if (!window.confirm("Excluir esta anotação?")) return;
    try { await api.delete(`/api/anotacoes/${id}`); setAnotacoes((atual) => atual.filter((item) => item.id !== id)); }
    catch { setErro("Não foi possível excluir a anotação."); }
  }

  const visiveis = anotacoes.filter((item) => `${item.texto} ${item.autor}`.toLowerCase().includes(busca.toLowerCase()));
  return (
    <div className="min-h-screen bg-background">
      <NavBarClient />
      <PageIntro eyebrow="Diário de cuidados" title="Anotações" text="Registros persistidos para manter você e seus cuidadores alinhados." />
      <main className="mx-auto max-w-5xl px-5 pb-16 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-lg border border-border bg-card px-4"><Search className="size-5 text-muted-foreground" /><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar anotações" className="w-full bg-transparent outline-none" /></label>
          <Button onClick={() => abrir()} className="min-h-12"><Plus className="size-5" /> Nova anotação</Button>
        </div>
        {erro && <p role="alert" className="mt-4 rounded-lg bg-destructive/10 p-4 text-destructive">{erro}</p>}
        <div className="mt-7 space-y-4">
          {visiveis.map((item) => <article key={item.id} className="rounded-lg border border-border bg-card p-5 shadow-soft">
            <div className="flex justify-between gap-4"><p className="text-xs font-semibold text-emergency">{dataHora(item.criadaEm)}</p><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => abrir(item)}><Edit3 className="size-4" /> Editar</Button><Button variant="ghost" size="sm" onClick={() => excluir(item.id)}><Trash2 className="size-4" /></Button></div></div>
            <p className="mt-3 whitespace-pre-wrap leading-7">{item.texto}</p><p className="mt-3 text-sm text-muted-foreground">Registrado por {item.autor}</p>
          </article>)}
          {!visiveis.length && <p className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">Nenhuma anotação encontrada.</p>}
        </div>
      </main>
      {modalAberto ? <Modal titulo={editando ? "Editar anotação" : "Nova anotação"} aoFechar={() => { setEditando(null); setTexto(""); setModalAberto(false); }}><form onSubmit={salvar} className="space-y-4"><textarea autoFocus value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={500} required className="min-h-32 w-full rounded-lg border border-input bg-background p-4" placeholder="Descreva o atendimento ou estado de saúde." /><Button disabled={salvando} type="submit">{salvando ? "Salvando..." : "Salvar"}</Button></form></Modal> : null}
    </div>
  );
}
