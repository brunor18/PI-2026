import { useEffect, useState } from "react";
import { ClipboardCheck, Edit3, Plus, Trash2 } from "lucide-react";
import { NavBarCaregiver } from "@/components/navbarCaregiver";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { PageIntro } from "../client/CuidadoresClient";
import api from "@/services/api.service";

export function AnotacoesCaregiver() {
  const [anotacoes, setAnotacoes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [texto, setTexto] = useState("");
  const [editando, setEditando] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [erro, setErro] = useState("");

  async function carregar() {
    const [notas, vinculados] = await Promise.all([api.get("/api/anotacoes"), api.get("/api/clientes/meus")]);
    setAnotacoes(notas.data); setClientes(vinculados.data.map((item) => item.cliente));
    if (!clienteId && vinculados.data[0]) setClienteId(String(vinculados.data[0].cliente.id));
  }
  useEffect(() => {
    let ativo = true;
    Promise.all([api.get("/api/anotacoes"), api.get("/api/clientes/meus")])
      .then(([notas, vinculados]) => {
        if (!ativo) return;
        setAnotacoes(notas.data);
        setClientes(vinculados.data.map((item) => item.cliente));
        if (vinculados.data[0]) setClienteId(String(vinculados.data[0].cliente.id));
      })
      .catch(() => { if (ativo) setErro("Não foi possível carregar as anotações dos clientes."); });
    return () => { ativo = false; };
  }, []);
  function abrir(item = null) { setEditando(item); setTexto(item?.texto || ""); setModalAberto(true); if (item) setClienteId(String(item.usuarioId)); }
  async function salvar(event) {
    event.preventDefault();
    try {
      const resposta = editando ? await api.patch(`/api/anotacoes/${editando.id}`, { texto }) : await api.post("/api/anotacoes", { usuarioId: Number(clienteId), texto });
      if (editando) setAnotacoes((atual) => atual.map((item) => item.id === editando.id ? { ...item, texto: resposta.data.texto } : item));
      else await carregar();
      setEditando(null); setTexto(""); setModalAberto(false);
    } catch (error) { setErro(error.response?.data?.mensagem || "Não foi possível salvar a anotação."); }
  }
  async function excluir(id) { if (!window.confirm("Excluir esta anotação?")) return; try { await api.delete(`/api/anotacoes/${id}`); setAnotacoes((atual) => atual.filter((item) => item.id !== id)); } catch { setErro("Não foi possível excluir a anotação."); } }

  return <div className="min-h-screen bg-background">
    <NavBarCaregiver />
    <PageIntro eyebrow="Registro de plantão" title="Anotações por cliente" text="Registre e consulte atendimentos persistidos no banco de dados." />
    <main className="mx-auto max-w-5xl px-5 pb-16 lg:px-8">
      {erro && <p role="alert" className="mb-4 rounded-lg bg-destructive/10 p-4 text-destructive">{erro}</p>}
      <Button onClick={() => abrir()} disabled={!clientes.length}><Plus className="size-4" /> Nova anotação</Button>
      <div className="mt-6 grid gap-4">{anotacoes.map((item) => <article key={item.id} className="rounded-lg border border-border bg-card p-5 shadow-soft">
        <div className="flex items-start justify-between gap-4"><div className="flex gap-3"><span className="grid size-10 place-items-center rounded-lg bg-success-soft text-success"><ClipboardCheck className="size-5" /></span><div><p className="font-semibold text-primary">{item.cliente || "Cliente"}</p><p className="text-xs text-muted-foreground">{new Date(item.criadaEm).toLocaleString("pt-BR")} • {item.autor}</p></div></div><div className="flex"><Button variant="ghost" size="sm" onClick={() => abrir(item)}><Edit3 className="size-4" /></Button><Button variant="ghost" size="sm" onClick={() => excluir(item.id)}><Trash2 className="size-4" /></Button></div></div>
        <p className="mt-4 leading-7">{item.texto}</p>
      </article>)}</div>
    </main>
    {modalAberto && <Modal titulo={editando ? "Editar anotação" : "Nova anotação"} aoFechar={() => { setEditando(null); setTexto(""); setModalAberto(false); }}><form onSubmit={salvar} className="space-y-4">{!editando && <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} required className="min-h-12 w-full rounded-lg border border-input bg-background px-3">{clientes.map((cliente) => <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>)}</select>}<textarea value={texto} onChange={(e) => setTexto(e.target.value)} required maxLength={500} className="min-h-32 w-full rounded-lg border border-input bg-background p-4" placeholder="Descreva o atendimento." /><Button type="submit">Salvar anotação</Button></form></Modal>}
  </div>;
}
