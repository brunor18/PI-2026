import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowRight, RotateCcw, Save, UserRound } from "lucide-react";
import { NavBarClient } from "@/components/navbarClient";
import { Button } from "@/components/ui/button";
import { obterDestinoDaSessao } from "@/lib/session";
import api from "@/services/api.service";

const campos = [
  { nome: "nome", rotulo: "Nome", tipo: "text", autoComplete: "name", maxLength: 200 },
  { nome: "idade", rotulo: "Idade (anos)", tipo: "number", min: 1, max: 130, step: 1 },
  { nome: "numeroTelefone", rotulo: "Telefone com DDD", tipo: "tel", autoComplete: "tel", maxLength: 30 },
  { nome: "endereco", rotulo: "Endereço", tipo: "text", autoComplete: "street-address", maxLength: 500 },
  { nome: "cidade", rotulo: "Cidade", tipo: "text", autoComplete: "address-level2", maxLength: 120 },
  { nome: "peso", rotulo: "Peso (kg)", tipo: "number", min: 1, max: 500, step: "0.01" },
  { nome: "altura", rotulo: "Altura (cm)", tipo: "number", min: 30, max: 250, step: "0.01" },
];
const campoClassName = "mt-2 min-h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

function formularioDoPerfil(perfil) {
  return Object.fromEntries([...campos.map((campo) => campo.nome), "descricao"].map((nome) => [nome, perfil[nome] ?? ""]));
}

export function PerfilClient() {
  const [perfil, setPerfil] = useState(null);
  const [formulario, setFormulario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const destino = obterDestinoDaSessao();

  useEffect(() => {
    if (destino !== "/HomeClient") return;
    const controller = new AbortController();
    async function carregar() {
      setCarregando(true);
      setErroCarregamento("");
      try {
        const { data } = await api.get("/api/clientes/me", { signal: controller.signal });
        if (!controller.signal.aborted) {
          setPerfil(data);
          setFormulario(formularioDoPerfil(data));
        }
      } catch (error) {
        if (!controller.signal.aborted) setErroCarregamento(error.response?.data?.mensagem || "Não foi possível carregar seu perfil. Tente novamente.");
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }
    carregar();
    return () => controller.abort();
  }, [destino, tentativa]);

  if (!destino) return <Navigate to="/login" replace />;
  if (destino !== "/HomeClient") return <Navigate to={destino} replace />;

  function atualizarCampo(nome, valor) {
    setFormulario((atual) => ({ ...atual, [nome]: valor }));
    setSucesso(false);
  }

  async function salvar(event) {
    event.preventDefault();
    if (salvando) return;
    setSalvando(true);
    setErro("");
    setSucesso(false);
    try {
      const { data } = await api.put("/api/clientes/me", {
        nome: formulario.nome.trim(), idade: Number(formulario.idade),
        numeroTelefone: formulario.numeroTelefone.trim(), endereco: formulario.endereco.trim(),
        cidade: formulario.cidade.trim(),
        peso: Number(formulario.peso), altura: Number(formulario.altura), descricao: formulario.descricao.trim(),
      });
      const usuario = JSON.parse(sessionStorage.getItem("usuario"));
      sessionStorage.setItem("usuario", JSON.stringify({ ...usuario, nome: data.nome, numeroTelefone: data.numeroTelefone, perfilCompleto: data.perfilCompleto }));
      setPerfil(data);
      setFormulario(formularioDoPerfil(data));
      setSucesso(true);
    } catch (error) {
      setErro(error.response?.data?.mensagem || Object.values(error.response?.data?.errors || {}).flat().join(" ") || "Não foi possível salvar seu perfil. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBarClient />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        <header className="border-b border-border pb-8 sm:pb-10"><h1 className="mt-2 font-heading text-3xl font-semibold text-primary sm:text-5xl">Meu perfil</h1><p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Complete suas informações para que os cuidadores conheçam melhor você e suas necessidades.</p></header>
        <section aria-label="Dados do perfil" aria-busy={carregando} className="mx-auto mt-8 max-w-4xl rounded-lg border border-border bg-card p-5 shadow-soft sm:p-8">
          {carregando ? <p role="status" className="py-8 text-center text-muted-foreground">Carregando seu perfil...</p> : erroCarregamento ? (
            <div className="py-8 text-center"><p role="alert" className="text-destructive">{erroCarregamento}</p><Button type="button" variant="outline" onClick={() => setTentativa((atual) => atual + 1)} className="mt-4 min-h-12"><RotateCcw aria-hidden="true" />Tentar novamente</Button></div>
          ) : formulario && (
            <>
              <div className="mb-6 flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-lg bg-muted text-primary"><UserRound aria-hidden="true" className="size-6" /></span><div><h2 className="font-heading text-2xl font-semibold text-primary">Suas informações</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{perfil.perfilCompleto ? "Mantenha seus dados atualizados sempre que precisar." : "Preencha os campos abaixo para concluir seu perfil."} Todos os campos são obrigatórios.</p></div></div>
              <form onSubmit={salvar}>
                <fieldset disabled={salvando} className="grid gap-5 sm:grid-cols-2">
                  <legend className="sr-only">Informações pessoais do cliente</legend>
                  {campos.map(({ nome, rotulo, tipo, ...props }) => <label key={nome} htmlFor={`perfil-${nome}`} className="block text-base font-medium text-foreground">{rotulo}<input id={`perfil-${nome}`} name={nome} type={tipo} value={formulario[nome]} onChange={(event) => atualizarCampo(nome, event.target.value)} required className={campoClassName} {...props} /></label>)}
                  <label htmlFor="perfil-descricao" className="block text-base font-medium text-foreground sm:col-span-2">Descrição<textarea id="perfil-descricao" name="descricao" value={formulario.descricao} onChange={(event) => atualizarCampo("descricao", event.target.value)} maxLength={2000} required placeholder="Conte sobre sua rotina, preferências e os cuidados de que precisa." className={`${campoClassName} min-h-36 resize-y`} /></label>
                </fieldset>
                {erro && <p role="alert" className="mt-5 rounded-lg bg-emergency-soft px-4 py-3 text-sm text-emergency">{erro}</p>}
                {sucesso && <p role="status" className="mt-5 rounded-lg bg-success-soft px-4 py-3 text-sm text-success">Perfil salvo com sucesso.</p>}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between"><Button type="submit" disabled={salvando} className="min-h-12"><Save aria-hidden="true" />{salvando ? "Salvando..." : "Salvar perfil"}</Button><Button asChild variant="outline" className="min-h-12"><Link to="/HomeClient">Ir para a visão geral<ArrowRight aria-hidden="true" /></Link></Button></div>
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
