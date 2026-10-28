import { Component, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, ClipboardList, HeartPulse, Pill, Plus, RotateCcw, Search, Stethoscope, X } from "lucide-react";
import { NavBarClient } from "@/components/navbarClient";
import { Button } from "@/components/ui/button";
import api from "@/services/api.service";

const categorias = [
  {
    id: "medicamentos",
    titulo: "Medicamentos",
    rota: "medicamentos",
    icon: Pill,
    vazio: "Nenhum medicamento cadastrado ainda.",
  },
  {
    id: "procedimentos",
    titulo: "Procedimentos cirúrgicos",
    rota: "procedimentos-cirurgicos",
    icon: Stethoscope,
    vazio: "Nenhum procedimento cirúrgico cadastrado ainda.",
  },
  {
    id: "campos",
    titulo: "Campos clínicos",
    rota: "campos-clinicos",
    icon: HeartPulse,
    vazio: "Nenhum campo clínico cadastrado ainda.",
  },
];

function lerUsuario() {
  try {
    return JSON.parse(sessionStorage.getItem("usuario") || "null");
  } catch {
    return null;
  }
}

function formatarData(data) {
  if (typeof data !== "string" || !data) return "";

  const [ano, mes, dia] = data.slice(0, 10).split("-").map(Number);
  if (!ano || !mes || !dia) return data;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(ano, mes - 1, dia)));
}

function normalizarBusca(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function filtrarRegistros(categoria, registros, busca) {
  const termo = normalizarBusca(busca);
  if (!termo) return registros;

  return registros.filter((registro) => {
    const valores = categoria === "medicamentos"
      ? [registro.nomeMedicamento, registro.dosagem, registro.frequencia, registro.descricao, registro.inicioTratamento, registro.fimTratamento, formatarData(registro.inicioTratamento), formatarData(registro.fimTratamento)]
      : categoria === "procedimentos"
        ? [registro.tipoProcedimento, registro.data, formatarData(registro.data), registro.observacoesMedicas]
        : [registro.nome, registro.valor, registro.descricao, registro.createdAt, formatarData(registro.createdAt)];

    return normalizarBusca(valores.join(" ")).includes(termo);
  });
}

function Detalhe({ rotulo, valor }) {
  if (!valor) return null;

  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {rotulo}
      </dt>
      <dd className="mt-1 break-words text-sm leading-6 text-foreground">
        {valor}
      </dd>
    </div>
  );
}

function CartaoRegistro({ categoria, registro, onEditar, onDeletar }) {
  if (categoria === "medicamentos") {
    return (
      <article className="flex h-full min-w-0 flex-col rounded-lg border border-border bg-card p-5 shadow-soft sm:p-6">
        <h3 className="break-words font-heading text-xl font-semibold text-primary">
          {registro.nomeMedicamento}
        </h3>
        <dl className="mt-4 grid flex-1 content-start gap-4 sm:grid-cols-2">
          <Detalhe rotulo="Dosagem" valor={registro.dosagem} />
          <Detalhe rotulo="Frequência" valor={registro.frequencia} />
          <Detalhe rotulo="Início do tratamento" valor={formatarData(registro.inicioTratamento)} />
          <Detalhe rotulo="Fim do tratamento" valor={formatarData(registro.fimTratamento)} />
          <div className="sm:col-span-2">
            <Detalhe rotulo="Descrição" valor={registro.descricao} />
          </div>
        </dl>
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
          <button type="button" onClick={() => onEditar(registro)} aria-label={`Editar ${registro.nomeMedicamento}`} className="flex min-h-11 items-center justify-center rounded-md text-sm font-semibold text-primary underline decoration-2 underline-offset-4 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Editar
          </button>
          <button type="button" onClick={() => onDeletar(registro)} aria-label={`Deletar ${registro.nomeMedicamento}`} className="flex min-h-11 items-center justify-center rounded-md text-sm font-semibold text-emergency underline decoration-2 underline-offset-4 hover:bg-emergency-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emergency">
            Deletar
          </button>
        </div>
      </article>
    );
  }

  if (categoria === "procedimentos") {
    return (
      <article className="min-w-0 rounded-lg border border-border bg-card p-5 shadow-soft sm:p-6">
        <h3 className="break-words font-heading text-xl font-semibold text-primary">
          {registro.tipoProcedimento}
        </h3>
        <dl className="mt-4 space-y-4">
          <Detalhe rotulo="Data do procedimento" valor={formatarData(registro.data)} />
          <Detalhe rotulo="Observações médicas" valor={registro.observacoesMedicas} />
        </dl>
      </article>
    );
  }

  return (
    <article className="min-w-0 rounded-lg border border-border bg-card p-5 shadow-soft sm:p-6">
      <h3 className="break-words font-heading text-xl font-semibold text-primary">
        {registro.nome}
      </h3>
      <dl className="mt-4 space-y-4">
        <Detalhe rotulo="Valor" valor={registro.valor} />
        <Detalhe rotulo="Descrição" valor={registro.descricao} />
        <Detalhe rotulo="Cadastrado em" valor={formatarData(registro.createdAt)} />
      </dl>
    </article>
  );
}

function CampoEdicao({ rotulo, nome, valor, aoAlterar, tipo = "text", multilinha = false, ...props }) {
  const id = `editar-${nome}`;
  const classe = "mt-2 min-h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">{rotulo}</label>
      {multilinha ? (
        <textarea
          id={id}
          name={nome}
          value={valor}
          onChange={(event) => aoAlterar(nome, event.target.value)}
          className={`${classe} min-h-24 resize-y`}
          {...props}
        />
      ) : (
        <input
          id={id}
          name={nome}
          type={tipo}
          value={valor}
          onChange={(event) => aoAlterar(nome, event.target.value)}
          className={classe}
          {...props}
        />
      )}
    </div>
  );
}

class LimiteErroRegistros extends Component {
  constructor(props) {
    super(props);
    this.state = { ocorreuErro: false };
  }

  static getDerivedStateFromError() {
    return { ocorreuErro: true };
  }

  render() {
    if (this.state.ocorreuErro) {
      return (
        <main className="grid min-h-screen place-items-center bg-background p-4">
          <section role="alert" className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-soft">
            <h1 className="font-heading text-2xl font-semibold text-primary">Não foi possível abrir seus registros</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Atualize a página para tentar novamente.</p>
            <Button type="button" onClick={() => window.location.reload()} className="mt-5 min-h-12">
              Atualizar página
            </Button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export function RegistrosClient() {
  return (
    <LimiteErroRegistros>
      <ConteudoRegistrosClient />
    </LimiteErroRegistros>
  );
}

function ConteudoRegistrosClient() {
  const [usuario] = useState(lerUsuario);
  const [registros, setRegistros] = useState({
    medicamentos: [],
    procedimentos: [],
    campos: [],
  });
  const [falhas, setFalhas] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [tentativa, setTentativa] = useState(0);
  const [buscas, setBuscas] = useState({ medicamentos: "", procedimentos: "", campos: "" });
  const [modal, setModal] = useState(null);
  const [formulario, setFormulario] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erroAcao, setErroAcao] = useState("");
  const [aviso, setAviso] = useState("");

  const usuarioId = usuario?.id;
  const acessoValido = Boolean(
    usuarioId &&
    Number(usuario?.tipoUsuario) === 1 &&
    sessionStorage.getItem("accessToken"),
  );

  useEffect(() => {
    if (!acessoValido) return;

    let ativo = true;

    async function carregarRegistros() {
      const respostas = await Promise.allSettled(
        categorias.map(({ rota }) => api.get(`/api/usuarios/${usuarioId}/${rota}`)),
      );

      if (!ativo) return;

      const novosRegistros = {};
      const novasFalhas = {};

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
        }
      });

      setRegistros(novosRegistros);
      setFalhas(novasFalhas);
      setCarregando(false);
    }

    carregarRegistros();

    return () => {
      ativo = false;
    };
  }, [acessoValido, usuarioId, tentativa]);

  if (!acessoValido) return <Navigate to="/login" replace />;

  function tentarNovamente() {
    setCarregando(true);
    setTentativa((atual) => atual + 1);
  }

  function abrirEdicao(registro) {
    setFormulario({
      nomeMedicamento: registro.nomeMedicamento || "",
      dosagem: registro.dosagem || "",
      frequencia: registro.frequencia || "",
      descricao: registro.descricao || "",
      inicioTratamento: registro.inicioTratamento?.slice(0, 10) || "",
      fimTratamento: registro.fimTratamento?.slice(0, 10) || "",
    });
    setModal({ tipo: "editar", registro });
    setErroAcao("");
    setAviso("");
  }

  function abrirExclusao(registro) {
    setModal({ tipo: "deletar", registro });
    setErroAcao("");
    setAviso("");
  }

  function fecharModal() {
    if (salvando) return;
    setModal(null);
    setFormulario(null);
    setErroAcao("");
  }

  function atualizarCampo(nome, valor) {
    setFormulario((atual) => ({ ...atual, [nome]: valor }));
  }

  async function salvarEdicao(event) {
    event.preventDefault();
    if (salvando || modal?.tipo !== "editar") return;

    if (![formulario.nomeMedicamento, formulario.dosagem, formulario.frequencia].every((valor) => valor.trim())) {
      setErroAcao("Preencha nome, dosagem e frequência do medicamento.");
      return;
    }
    if (formulario.fimTratamento < formulario.inicioTratamento) {
      setErroAcao("A data de término deve ser igual ou posterior à data de início.");
      return;
    }

    setSalvando(true);
    setErroAcao("");
    try {
      const { data } = await api.patch(`/api/usuarios/${usuarioId}/medicamentos/${modal.registro.id}`, {
        nomeMedicamento: formulario.nomeMedicamento.trim(),
        dosagem: formulario.dosagem.trim(),
        frequencia: formulario.frequencia.trim(),
        descricao: formulario.descricao.trim(),
        inicioTratamento: `${formulario.inicioTratamento}T00:00:00`,
        fimTratamento: `${formulario.fimTratamento}T00:00:00`,
      });
      setRegistros((atuais) => ({
        ...atuais,
        medicamentos: atuais.medicamentos.map((item) => item.id === modal.registro.id ? data : item),
      }));
      setModal(null);
      setFormulario(null);
      setAviso("Medicamento atualizado com sucesso.");
    } catch (error) {
      setErroAcao(error.response?.data?.mensagem || "Não foi possível atualizar o medicamento. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function removerMedicamento() {
    if (salvando || modal?.tipo !== "deletar") return;

    setSalvando(true);
    setErroAcao("");
    try {
      await api.delete(`/api/usuarios/${usuarioId}/medicamentos/${modal.registro.id}`);
      setRegistros((atuais) => ({
        ...atuais,
        medicamentos: atuais.medicamentos.filter((item) => item.id !== modal.registro.id),
      }));
      setModal(null);
      setAviso("Medicamento removido com sucesso.");
    } catch (error) {
      setErroAcao(error.response?.data?.mensagem || "Não foi possível remover o medicamento. Tente novamente.");
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
            Todos os registros
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Consulte os medicamentos, procedimentos cirúrgicos e campos clínicos cadastrados na sua conta.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">

            <Button asChild variant="outline" className="min-h-12 w-full sm:w-auto">
              <Link to="/HomeClient">
                <ArrowLeft aria-hidden="true" />
                Voltar à visão geral
              </Link>
            </Button>


            <Button asChild className="min-h-12 w-full sm:w-auto">
              <Link to="/HomeClient">
                <Plus aria-hidden="true" />
                Novo registro
              </Link>
            </Button>
          </div>
        </header>

        {aviso && (
          <p role="status" className="mt-6 rounded-lg bg-success-soft px-4 py-3 text-sm font-medium text-success">
            {aviso}
          </p>
        )}

        <section aria-label="Resumo dos registros" className="grid gap-4 py-8 sm:grid-cols-3 sm:py-10">
          {categorias.map(({ id, titulo, icon: Icon }) => (
            <div key={id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-soft">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-muted text-primary">
                <Icon aria-hidden="true" className="size-6" />
              </span>
              <div>
                <p className="font-heading text-2xl font-semibold text-primary">
                  {carregando || falhas[id] ? "—" : registros[id].length}
                </p>
                <p className="text-sm text-muted-foreground">{titulo}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="space-y-12">
          {categorias.map(({ id, titulo, vazio, icon: Icon }) => {
            const registrosVisiveis = filtrarRegistros(id, registros[id], buscas[id]);

            return (
              <section key={id} aria-labelledby={`titulo-${id}`}>
                <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
                  <Icon aria-hidden="true" className="size-6 shrink-0 text-primary" />
                  <h2 id={`titulo-${id}`} className="font-heading text-2xl font-semibold text-primary sm:text-3xl">
                    {titulo}
                  </h2>
                </div>

                <label className="mb-5 flex min-h-12 w-full max-w-md items-center gap-3 rounded-lg border border-input bg-card px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                  <Search aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
                  <span className="sr-only">Pesquisar {titulo.toLowerCase()}</span>
                  <input
                    type="search"
                    value={buscas[id]}
                    onChange={(event) => setBuscas((atuais) => ({ ...atuais, [id]: event.target.value }))}
                    placeholder={`Pesquisar ${titulo.toLowerCase()}`}
                    disabled={carregando || Boolean(falhas[id]) || registros[id].length === 0}
                    className="min-w-0 flex-1 bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                  />
                </label>

                {carregando ? (
                  <p className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
                    Carregando registros...
                  </p>
                ) : falhas[id] ? (
                  <div role="alert" className="rounded-lg border border-border bg-card p-6">
                    <p className="text-sm text-emergency">Não foi possível carregar estes registros.</p>
                    <Button type="button" variant="outline" onClick={tentarNovamente} className="mt-4 min-h-12">
                      <RotateCcw aria-hidden="true" />
                      Tentar novamente
                    </Button>
                  </div>
                ) : registros[id].length === 0 ? (
                  <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
                    <p className="text-muted-foreground">{vazio}</p>
                    <Link to="/HomeClient" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4">
                      Ir para a visão geral
                    </Link>
                  </div>
                ) : registrosVisiveis.length === 0 ? (
                  <p role="status" className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
                    Nenhum registro encontrado para “{buscas[id]}”.
                  </p>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 lg:gap-6">
                    {registrosVisiveis.map((registro) => (
                      <CartaoRegistro
                        key={registro.id}
                        categoria={id}
                        registro={registro}
                        onEditar={abrirEdicao}
                        onDeletar={abrirExclusao}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <aside className="mt-12 rounded-lg bg-primary p-5 text-primary-foreground shadow-brand sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-highlight">
                <ClipboardList aria-hidden="true" className="size-5" />
                <p className="text-sm font-medium">Seu cuidado, organizado</p>
              </div>
              <h2 className="mt-2 font-heading text-xl font-semibold sm:text-2xl">
                Quer adicionar outro registro?
              </h2>
            </div>
            <Button asChild variant="secondary" className="min-h-12 w-full shrink-0 sm:w-auto">
              <Link to="/HomeClient">Ir para a visão geral</Link>
            </Button>
          </div>
        </aside>
      </main>

      {modal && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-overlay sm:items-center sm:p-5"
          onMouseDown={(event) => { if (event.target === event.currentTarget) fecharModal(); }}
          onKeyDown={(event) => { if (event.key === "Escape") fecharModal(); }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="acao-medicamento-titulo"
            className="max-h-[95dvh] w-full overflow-y-auto rounded-t-lg bg-card p-5 shadow-modal sm:max-h-[90dvh] sm:max-w-xl sm:rounded-lg sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emergency">Medicamentos</p>
                <h2 id="acao-medicamento-titulo" className="mt-1 font-heading text-2xl font-semibold text-primary">
                  {modal.tipo === "editar" ? "Editar medicamento" : "Deletar medicamento"}
                </h2>
              </div>
              <Button type="button" variant="ghost" size="icon" aria-label="Fechar" disabled={salvando} onClick={fecharModal} className="size-11 shrink-0 !text-destructive hover:!bg-destructive/10 hover:!text-destructive [&_svg]:!size-7">
                <X aria-hidden="true" strokeWidth={2.5} />
              </Button>
            </div>

            {modal.tipo === "editar" ? (
              <form onSubmit={salvarEdicao} className="mt-6 space-y-4">
                <CampoEdicao rotulo="Nome do medicamento" nome="nomeMedicamento" valor={formulario.nomeMedicamento} aoAlterar={atualizarCampo} required autoFocus />
                <div className="grid gap-4 sm:grid-cols-2">
                  <CampoEdicao rotulo="Dosagem" nome="dosagem" valor={formulario.dosagem} aoAlterar={atualizarCampo} required />
                  <CampoEdicao rotulo="Frequência" nome="frequencia" valor={formulario.frequencia} aoAlterar={atualizarCampo} required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <CampoEdicao rotulo="Início do tratamento" nome="inicioTratamento" tipo="date" valor={formulario.inicioTratamento} aoAlterar={atualizarCampo} required />
                  <CampoEdicao rotulo="Fim do tratamento" nome="fimTratamento" tipo="date" valor={formulario.fimTratamento} aoAlterar={atualizarCampo} min={formulario.inicioTratamento} required />
                </div>
                <CampoEdicao rotulo="Descrição (opcional)" nome="descricao" valor={formulario.descricao} aoAlterar={atualizarCampo} multilinha />
                {erroAcao && <p role="alert" className="rounded-lg bg-emergency-soft px-4 py-3 text-sm text-emergency">{erroAcao}</p>}
                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" onClick={fecharModal} disabled={salvando} className="min-h-12 w-full sm:w-auto">Cancelar</Button>
                  <Button type="submit" disabled={salvando} className="min-h-12 w-full sm:w-auto">{salvando ? "Salvando..." : "Salvar alterações"}</Button>
                </div>
              </form>
            ) : (
              <div className="mt-6">
                <p className="break-words text-sm leading-6 text-foreground">
                  Deseja deletar <strong>{modal.registro.nomeMedicamento}</strong>? Esta ação não pode ser desfeita.
                </p>
                {erroAcao && <p role="alert" className="mt-4 rounded-lg bg-emergency-soft px-4 py-3 text-sm text-emergency">{erroAcao}</p>}
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" onClick={fecharModal} disabled={salvando} autoFocus className="min-h-12 w-full sm:w-auto">Cancelar</Button>
                  <Button type="button" variant="destructive" onClick={removerMedicamento} disabled={salvando} className="min-h-12 w-full sm:w-auto">
                    {salvando ? "Deletando..." : "Deletar medicamento"}
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
