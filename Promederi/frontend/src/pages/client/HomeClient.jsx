import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowRight, ClipboardList, HeartPulse, Pill, Plus, Stethoscope, Users, X } from "lucide-react";
import lucianaPhoto from "@/assets/luciana-ribeiro.jpg";
import { NavBarClient } from "@/components/navbarClient";
import { Button } from "@/components/ui/button";
import api from "@/services/api.service";

const categorias = [
  { id: "medicamentos", titulo: "Medicamentos", singular: "medicamento", descricao: "Organize os remédios, doses e períodos de tratamento.", acao: "Cadastrar medicamento", icon: Pill, rota: "medicamentos" },
  { id: "procedimentos", titulo: "Procedimentos cirúrgicos", singular: "procedimento", descricao: "Guarde as datas e informações das suas cirurgias.", acao: "Cadastrar procedimento", icon: Stethoscope, rota: "procedimentos-cirurgicos" },
  { id: "campos", titulo: "Campos clínicos", singular: "campo clínico", descricao: "Registre informações importantes sobre sua saúde.", acao: "Cadastrar campo clínico", icon: HeartPulse, rota: "campos-clinicos" },
];

const formulariosIniciais = {
  medicamentos: { nomeMedicamento: "", dosagem: "", frequencia: "", descricao: "", inicioTratamento: "", fimTratamento: "" },
  procedimentos: { data: "", tipoProcedimento: "", observacoesMedicas: "" },
  campos: { nome: "", valor: "", descricao: "" },
};

const campoClassName = "mt-2 min-h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

function lerUsuario() {
  try {
    return JSON.parse(sessionStorage.getItem("usuario") || "null");
  } catch {
    return null;
  }
}

function mensagemErro(error) {
  return error.response?.data?.mensagem || "Não foi possível concluir a operação. Tente novamente.";
}

function formatarData(data) {
  if (typeof data !== "string" || !data) return "Data não informada";
  const [ano, mes, dia] = data.slice(0, 10).split("-").map(Number);
  if (!ano || !mes || !dia) return data;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(ano, mes - 1, dia)));
}

function resumoRegistro(categoria, registro) {
  if (categoria === "medicamentos") {
    return {
      titulo: registro.nomeMedicamento,
      detalhe: [registro.dosagem, registro.frequencia].filter(Boolean).join(" • "),
      extra: `De ${formatarData(registro.inicioTratamento)} até ${formatarData(registro.fimTratamento)}`,
    };
  }
  if (categoria === "procedimentos") {
    return { titulo: registro.tipoProcedimento, detalhe: formatarData(registro.data), extra: registro.observacoesMedicas };
  }
  return { titulo: registro.nome, detalhe: registro.valor, extra: registro.descricao };
}

export function HomeClient() {
  const [usuario] = useState(lerUsuario);
  const [registros, setRegistros] = useState({ medicamentos: [], procedimentos: [], campos: [] });
  const [cuidadores, setCuidadores] = useState([]);
  const [carregandoCuidadores, setCarregandoCuidadores] = useState(true);
  const [erroCuidadores, setErroCuidadores] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erroListagem, setErroListagem] = useState("");
  const [falhasListagem, setFalhasListagem] = useState({});
  const [categoriaAberta, setCategoriaAberta] = useState(null);
  const [formulario, setFormulario] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erroFormulario, setErroFormulario] = useState("");
  const [aviso, setAviso] = useState("");

  const usuarioId = usuario?.id;
  const acessoValido = Boolean(usuarioId && Number(usuario?.tipoUsuario) === 1 && sessionStorage.getItem("accessToken"));

  useEffect(() => {
    if (!acessoValido) return;
    let ativo = true;

    async function carregarCuidadores() {
      try {
        const { data } = await api.get("/api/cuidadores/MeusCuidadores");
        if (ativo) setCuidadores(Array.isArray(data) ? data : []);
      } catch {
        if (ativo) setErroCuidadores(true);
      } finally {
        if (ativo) setCarregandoCuidadores(false);
      }
    }

    async function carregarRegistros() {
      const respostas = await Promise.allSettled(
        categorias.map(({ rota }) => api.get(`/api/usuarios/${usuarioId}/${rota}`)),
      );
      if (!ativo) return;

      const novosRegistros = {};
      const novasFalhas = {};
      let houveErro = false;
      respostas.forEach((resposta, indice) => {
        const categoria = categorias[indice].id;
        if (resposta.status === "fulfilled" && Array.isArray(resposta.value.data)) {
          novosRegistros[categoria] = resposta.value.data
            .filter((registro) => registro && typeof registro === "object")
            .sort((a, b) => b.id - a.id);
        } else if (resposta.status === "rejected" && categoria === "medicamentos" && resposta.reason.response?.status === 404) {
          novosRegistros[categoria] = [];
        } else {
          novosRegistros[categoria] = [];
          novasFalhas[categoria] = true;
          houveErro = true;
        }
      });
      setRegistros(novosRegistros);
      setFalhasListagem(novasFalhas);
      setErroListagem(houveErro ? "Alguns registros não puderam ser carregados. Atualize a página para tentar novamente." : "");
      setCarregando(false);
    }


    carregarRegistros();
    carregarCuidadores();
    return () => { ativo = false; };
  }, [acessoValido, usuarioId]);

  if (!acessoValido) return <Navigate to="/login" replace />;

  const primeiroNome = usuario.nome?.trim().split(/\s+/)[0] || "cliente";

  function abrirFormulario(categoria) {
    setCategoriaAberta(categoria);
    setFormulario({ ...formulariosIniciais[categoria] });
    setErroFormulario("");
    setAviso("");
  }

  function fecharFormulario() {
    if (salvando) return;
    setCategoriaAberta(null);
    setFormulario(null);
    setErroFormulario("");
  }

  function atualizarCampo(nome, valor) {
    setFormulario((atual) => ({ ...atual, [nome]: valor }));
  }

  async function salvarRegistro(event) {
    event.preventDefault();
    if (salvando) return;

    if (categoriaAberta === "medicamentos" && formulario.fimTratamento < formulario.inicioTratamento) {
      setErroFormulario("A data de término deve ser igual ou posterior à data de início.");
      return;
    }

    const categoria = categorias.find((item) => item.id === categoriaAberta);
    const dados = categoriaAberta === "medicamentos"
      ? { ...formulario, inicioTratamento: `${formulario.inicioTratamento}T00:00:00`, fimTratamento: `${formulario.fimTratamento}T00:00:00` }
      : formulario;

    setSalvando(true);
    setErroFormulario("");
    try {
      const { data } = await api.post(`/api/usuarios/${usuarioId}/${categoria.rota}`, dados);
      setRegistros((atuais) => ({ ...atuais, [categoriaAberta]: [data, ...atuais[categoriaAberta]] }));
      setAviso(`${categoria.singular.charAt(0).toUpperCase()}${categoria.singular.slice(1)} cadastrado com sucesso.`);
      setCategoriaAberta(null);
      setFormulario(null);
    } catch (error) {
      setErroFormulario(mensagemErro(error));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBarClient />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        <header className="border-b border-border pb-8 sm:pb-10">
          <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight text-primary sm:text-5xl">
            Boas-vindas, {primeiroNome}!
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Cuide das suas informações de saúde em um só lugar. Comece por um dos cadastros abaixo.
          </p>
        </header>

        {aviso && <p role="status" className="mt-6 rounded-lg bg-success-soft px-4 py-3 text-sm font-medium text-success">{aviso}</p>}
        {erroListagem && <p role="alert" className="mt-6 rounded-lg bg-emergency-soft px-4 py-3 text-sm text-emergency">{erroListagem}</p>}

        <section aria-labelledby="acoes-titulo" className="pt-8 sm:pt-10">
          <div className="mb-5">
            <h2 id="acoes-titulo" className="font-heading text-2xl font-semibold text-primary sm:text-3xl">O que deseja registrar?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">Escolha uma opção para adicionar informações ao seu histórico.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
            {categorias.map(({ id, titulo, descricao, acao, icon: Icon }) => (
              <article key={id} className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-5 shadow-soft sm:p-6">
                <span className="grid size-12 place-items-center rounded-lg bg-muted text-primary"><Icon aria-hidden="true" className="size-6" /></span>
                <h3 className="mt-5 font-heading text-xl font-semibold text-primary">{titulo}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{descricao}</p>
                <Button type="button" onClick={() => abrirFormulario(id)} disabled={carregando} className="mt-6 min-h-12 w-full justify-between px-4 text-sm sm:text-base">
                  <span className="flex items-center gap-2"><Plus aria-hidden="true" className="size-4" />{acao}</span>
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="historico-titulo" className="pt-12 sm:pt-14">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-muted text-primary"><ClipboardList aria-hidden="true" className="size-5" /></span>
              <div>
                <h2 id="historico-titulo" className="font-heading text-2xl font-semibold text-primary sm:text-3xl">Seus registros</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">Veja seus cadastros mais recentes.</p>
              </div>
            </div>
            <Button asChild variant="outline" className="min-h-12 w-full shrink-0 sm:w-auto">
              <Link to="/RegistrosClient">Ver todos os Registros <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
            {categorias.map(({ id, titulo, singular, icon: Icon }) => (
              <section key={id} aria-label={titulo} className="min-w-0 rounded-lg border border-border bg-card p-5 shadow-soft sm:p-6">
                <div className="flex items-center gap-3">
                  <Icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
                  <h3 className="font-heading text-lg font-semibold text-primary">{titulo}</h3>
                </div>
                {carregando ? (
                  <p className="mt-5 text-sm text-muted-foreground">Carregando registros...</p>
                ) : falhasListagem[id] ? (
                  <p className="mt-5 rounded-lg bg-emergency-soft px-4 py-5 text-sm leading-6 text-emergency">Não foi possível carregar estes registros.</p>
                ) : registros[id].length === 0 ? (
                  <p className="mt-5 rounded-lg bg-background px-4 py-5 text-sm leading-6 text-muted-foreground">Nenhum {singular} cadastrado ainda.</p>
                ) : (
                  <ul className="mt-5 divide-y divide-border">
                    {registros[id].slice(0, 2).map((registro) => {
                      const resumo = resumoRegistro(id, registro);
                      return (
                        <li key={registro.id} className="min-w-0 py-4 first:pt-0 last:pb-0">
                          <p className="break-words font-semibold text-primary">{resumo.titulo}</p>
                          {resumo.detalhe && <p className="mt-1 break-words text-sm leading-6 text-foreground">{resumo.detalhe}</p>}
                          {resumo.extra && <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{resumo.extra}</p>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </section>

        <section aria-labelledby="cuidadores-titulo" className="pt-12 sm:pt-14">
          <div className="mb-5 flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-muted text-primary">
              <Users aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2 id="cuidadores-titulo" className="font-heading text-2xl font-semibold text-primary sm:text-3xl">Meus Cuidadores</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Acompanhe os profissionais que fazem parte da sua rede de cuidado.</p>
            </div>
          </div>
          {carregandoCuidadores ? (
            <p className="text-sm text-muted-foreground">Carregando cuidadores...</p>
          ) : erroCuidadores ? (
            <p role="alert" className="rounded-lg bg-emergency-soft px-4 py-5 text-sm text-emergency">
              Não foi possível carregar os cuidadores.
            </p>
          ) : cuidadores.length === 0 ? (
            <p className="rounded-lg bg-background px-4 py-5 text-sm leading-6 text-muted-foreground">
              Você ainda não tem cuidadores vinculados.
            </p>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cuidadores.map((c) => (
                  <article
                    key={c.id}
                    className="flex min-w-0 items-start gap-4 rounded-lg border border-border bg-card p-5 shadow-soft"
                  >
                    <span className="grid size-14 shrink-0 place-items-center rounded-full bg-muted text-lg font-semibold text-primary">
                      {c.nome?.trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-heading text-lg font-semibold text-primary">{c.nome}</h3>
                      {c.idade != null && <p className="mt-1 text-sm text-muted-foreground">{c.idade} anos</p>}
                      {c.numeroTelefone && <p className="mt-1 break-words text-sm text-foreground">{c.numeroTelefone}</p>}
                      {c.descricao && <p className="mt-2 line-clamp-2 break-words text-xs leading-5 text-muted-foreground">{c.descricao}</p>}
                    </div>
                  </article>
                ))}
              </div>
              <Button asChild variant="outline" className="mt-5 min-h-12 w-full sm:w-auto">
                <Link to="/CuidadoresClient">Ver cuidadores <ArrowRight aria-hidden="true" /></Link>
              </Button>
            </>
          )}
        </section>

        <aside className="mt-8 rounded-lg bg-primary p-5 text-primary-foreground shadow-brand sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-highlight">Seu cuidado, organizado</p>
              <h2 className="mt-1 font-heading text-xl font-semibold sm:text-2xl">Precisa registrar uma observação?</h2>
              <p className="mt-2 text-sm leading-6 text-primary-foreground/80">Use suas anotações para acompanhar detalhes do dia a dia.</p>
            </div>
            <Button asChild variant="secondary" className="min-h-12 w-full shrink-0 sm:w-auto">
              <Link to="/AnotacoesClient">Ver anotações <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>
        </aside>
      </main>

      {categoriaAberta && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-overlay sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) fecharFormulario(); }} onKeyDown={(event) => { if (event.key === "Escape") fecharFormulario(); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="formulario-titulo" className="max-h-[95dvh] w-full overflow-y-auto rounded-t-lg bg-card p-5 shadow-modal sm:max-h-[90dvh] sm:max-w-xl sm:rounded-lg sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emergency">Novo registro</p>
                <h2 id="formulario-titulo" className="mt-1 font-heading text-2xl font-semibold text-primary">{categorias.find((item) => item.id === categoriaAberta).acao}</h2>
              </div>
              <Button type="button" variant="ghost" size="icon" aria-label="Fechar formulário" disabled={salvando} onClick={fecharFormulario} className="size-11 shrink-0 !text-destructive hover:!bg-destructive/10 hover:!text-destructive [&_svg]:!size-7"><X aria-hidden="true" strokeWidth={2.5} /></Button>
            </div>
            <form onSubmit={salvarRegistro} className="mt-6 space-y-4">
              {categoriaAberta === "medicamentos" && (
                <>
                  <Campo label="Nome do medicamento" nome="nomeMedicamento" valor={formulario.nomeMedicamento} atualizar={atualizarCampo} required autoFocus />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Campo label="Dosagem" nome="dosagem" valor={formulario.dosagem} atualizar={atualizarCampo} required placeholder="Ex.: 50 mg" />
                    <Campo label="Frequência" nome="frequencia" valor={formulario.frequencia} atualizar={atualizarCampo} required placeholder="Ex.: 1 vez ao dia" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Campo label="Início do tratamento" nome="inicioTratamento" tipo="date" valor={formulario.inicioTratamento} atualizar={atualizarCampo} required />
                    <Campo label="Fim do tratamento" nome="fimTratamento" tipo="date" valor={formulario.fimTratamento} atualizar={atualizarCampo} required min={formulario.inicioTratamento} />
                  </div>
                  <Campo label="Descrição (opcional)" nome="descricao" valor={formulario.descricao} atualizar={atualizarCampo} multiline />
                </>
              )}
              {categoriaAberta === "procedimentos" && (
                <>
                  <Campo label="Tipo de procedimento" nome="tipoProcedimento" valor={formulario.tipoProcedimento} atualizar={atualizarCampo} required maxLength={200} autoFocus />
                  <Campo label="Data do procedimento" nome="data" tipo="date" valor={formulario.data} atualizar={atualizarCampo} required />
                  <Campo label="Observações médicas (opcional)" nome="observacoesMedicas" valor={formulario.observacoesMedicas} atualizar={atualizarCampo} maxLength={5000} multiline />
                </>
              )}
              {categoriaAberta === "campos" && (
                <>
                  <Campo label="Nome do campo" nome="nome" valor={formulario.nome} atualizar={atualizarCampo} required maxLength={100} placeholder="Ex.: Tipo sanguíneo" autoFocus />
                  <Campo label="Valor (opcional)" nome="valor" valor={formulario.valor} atualizar={atualizarCampo} maxLength={5000} placeholder="Ex.: O+" />
                  <Campo label="Descrição (opcional)" nome="descricao" valor={formulario.descricao} atualizar={atualizarCampo} maxLength={500} multiline />
                </>
              )}
              {erroFormulario && <p role="alert" className="rounded-lg bg-emergency-soft px-4 py-3 text-sm text-emergency">{erroFormulario}</p>}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={fecharFormulario} disabled={salvando} className="min-h-12 w-full sm:w-auto">Cancelar</Button>
                <Button type="submit" disabled={salvando} className="min-h-12 w-full sm:w-auto">{salvando ? "Salvando..." : "Salvar registro"}</Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function Campo({ label, nome, valor, atualizar, tipo = "text", multiline = false, ...props }) {
  const id = `registro-${nome}`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">{label}</label>
      {multiline ? (
        <textarea id={id} name={nome} value={valor} onChange={(event) => atualizar(nome, event.target.value)} className={`${campoClassName} min-h-24 resize-y`} {...props} />
      ) : (
        <input id={id} name={nome} type={tipo} value={valor} onChange={(event) => atualizar(nome, event.target.value)} className={campoClassName} {...props} />
      )}
    </div>
  );
}
