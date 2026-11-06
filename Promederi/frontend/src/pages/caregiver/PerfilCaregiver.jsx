import { useEffect, useState } from "react";
import { BadgeCheck, BriefcaseMedical, Edit3, Mail, MapPin, Phone } from "lucide-react";
import { NavBarCaregiver } from "@/components/navbarCaregiver";
import { Button } from "@/components/ui/button";
import { PageIntro } from "../client/CuidadoresClient";
import api from "@/services/api.service";

const vazio = { nome: "", funcao: "", experiencia: "", email: "", numeroTelefone: "", areaAtendimento: "", descricao: "", especialidades: "", numero: "", endereco: "" };
const campos = [["nome", "Nome"], ["funcao", "Função"], ["experiencia", "Experiência"], ["areaAtendimento", "Área de atendimento"], ["numeroTelefone", "Telefone"], ["numero", "Número"], ["endereco", "Endereço"], ["especialidades", "Especialidades"]];

export function PerfilCaregiver() {
  const [perfil, setPerfil] = useState(vazio);
  const [editando, setEditando] = useState(false);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  useEffect(() => { api.get("/api/cuidadores/me").then(({ data }) => setPerfil(data)).catch(() => setErro("Não foi possível carregar seu perfil.")); }, []);
  function alterar(campo, valor) { setPerfil((atual) => ({ ...atual, [campo]: valor })); }
  async function salvar() {
    setSalvando(true); setErro("");
    try { const { data } = await api.put("/api/cuidadores/me", perfil); setPerfil(data); setEditando(false); }
    catch (error) { setErro(error.response?.data?.mensagem || "Não foi possível salvar seu perfil."); }
    finally { setSalvando(false); }
  }
  return <div className="min-h-screen bg-background"><NavBarCaregiver /><PageIntro eyebrow="Dados profissionais" title="Meu perfil" text="Informações visíveis para as famílias que confiam o cuidado a você." /><main className="mx-auto max-w-5xl px-5 pb-16">
    {erro && <p role="alert" className="mb-4 rounded-lg bg-destructive/10 p-4 text-destructive">{erro}</p>}
    <section className="rounded-lg border border-border bg-card p-7 shadow-soft"><div className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-start sm:justify-between"><div><p className="flex items-center gap-2 text-sm font-semibold text-success"><BadgeCheck className="size-5" /> Perfil verificado</p><h2 className="mt-2 font-heading text-3xl font-semibold text-primary">{perfil.nome || "Carregando..."}</h2><p className="mt-2 text-muted-foreground">{perfil.funcao} {perfil.experiencia && `• ${perfil.experiencia}`}</p><p className="mt-4 max-w-2xl leading-7">{perfil.descricao}</p></div><Button onClick={() => editando ? salvar() : setEditando(true)} disabled={salvando}>{editando ? "Salvar perfil" : <><Edit3 className="size-4" /> Editar perfil</>}</Button></div>
      {editando ? <div className="mt-7 grid gap-4 sm:grid-cols-2">{campos.map(([campo, rotulo]) => <label key={campo} className="text-sm font-medium">{rotulo}<input value={perfil[campo] || ""} onChange={(e) => alterar(campo, e.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-input bg-background px-4" /></label>)}<label className="text-sm font-medium sm:col-span-2">Apresentação<textarea value={perfil.descricao || ""} onChange={(e) => alterar("descricao", e.target.value)} className="mt-2 min-h-28 w-full rounded-lg border border-input bg-background p-4" /></label></div> : <div className="mt-7 grid gap-4 sm:grid-cols-2"><Info icon={Mail} label="E-mail" value={perfil.email} /><Info icon={Phone} label="Telefone" value={perfil.numeroTelefone} /><Info icon={MapPin} label="Área de atendimento" value={perfil.areaAtendimento} /><Info icon={BriefcaseMedical} label="Especialidades" value={perfil.especialidades} /></div>}
    </section>
  </main></div>;
}
function Info({ icon: Icon, label, value }) { return <div className="rounded-lg bg-background p-4"><p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Icon className="size-4 text-emergency" />{label}</p><p className="mt-2 break-words text-sm">{value || "Não informado"}</p></div>; }
