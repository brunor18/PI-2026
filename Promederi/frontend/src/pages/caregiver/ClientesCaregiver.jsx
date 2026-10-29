import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import {
  ClipboardList,
  HeartPulse,
  Pill,
  RotateCcw,
  Stethoscope,
  Users,
} from "lucide-react";
import { NavBarCaregiver } from "@/components/navbarCaregiver";
import { Button } from "@/components/ui/button";
import { obterDestinoDaSessao } from "@/lib/session";
import api from "@/services/api.service";
import { PageIntro } from "../client/CuidadoresClient";
import { PesquisarClientesCaregiver } from "./PesquisarClientesCaregiver";

const categorias = [
  {
    id: "medicamentos",
    titulo: "Medicamentos",
    icon: Pill,
    vazio: "Nenhum medicamento cadastrado para este cliente.",
  },
  {
    id: "procedimentos",
    titulo: "Procedimentos cirúrgicos",
    icon: Stethoscope,
    vazio: "Nenhum procedimento cirúrgico cadastrado para este cliente.",
  },
  {
    id: "campos",
    titulo: "Campos clínicos",
    icon: HeartPulse,
    vazio: "Nenhum campo clínico cadastrado para este cliente.",
  },
];

function formatarData(valor) {
  if (!valor) return "Não informada";
  const data = new Date(`${String(valor).slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(data.getTime())) return "Não informada";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(data);
}

function Detalhe({ rotulo, valor }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold text-muted-foreground">{rotulo}</dt>
      <dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
        {valor == null || valor === "" ? "Não informado" : valor}
      </dd>
    </div>
  );
}

function CartaoRegistro({ categoria, registro }) {
  let titulo;
  let detalhes;

  if (categoria === "medicamentos") {
    titulo = registro.nomeMedicamento;
    detalhes = [
      ["Dosagem", registro.dosagem],
      ["Frequência", registro.frequencia],
      ["Início do tratamento", formatarData(registro.inicioTratamento)],
      ["Fim do tratamento", formatarData(registro.fimTratamento)],
      ["Descrição", registro.descricao],
      ["Cadastrado em", formatarData(registro.createdAt)],
    ];
  } else if (categoria === "procedimentos") {
    titulo = registro.tipoProcedimento;
    detalhes = [
      ["Data do procedimento", formatarData(registro.data)],
      ["Observações médicas", registro.observacoesMedicas],
    ];
  } else {
    titulo = registro.nome;
    detalhes = [
      ["Valor", registro.valor],
      ["Descrição", registro.descricao],
      ["Cadastrado em", formatarData(registro.createdAt)],
    ];
  }

  return (
    <article className="min-w-0 rounded-lg border border-border bg-background p-4 sm:p-5">
      <h4 className="break-words font-heading text-lg font-semibold text-primary">
        {titulo}
      </h4>
      <dl className="mt-4 grid gap-4">
        {detalhes.map(([rotulo, valor]) => (
          <Detalhe key={rotulo} rotulo={rotulo} valor={valor} />
        ))}
      </dl>
    </article>
  );
}

function CartaoCliente({ cliente, registros }) {
  const total = categorias.reduce(
    (soma, categoria) => soma + registros[categoria.id].length,
    0,
  );

  return (
    <article className="min-w-0 rounded-lg border border-border bg-card p-5 shadow-soft sm:p-7">
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span
            aria-hidden="true"
            className="grid size-14 shrink-0 place-items-center rounded-full bg-secondary font-heading text-2xl font-semibold text-primary"
          >
            {Array.from(cliente.nome || "C")[0].toLocaleUpperCase("pt-BR")}
          </span>
          <div className="min-w-0">
            <h2 className="break-words font-heading text-2xl font-semibold text-primary sm:text-3xl">
              {cliente.nome}
            </h2>
            <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">
              {cliente.idade != null ? `${cliente.idade} anos` : "Idade não informada"}
              {cliente.cidade ? ` · ${cliente.cidade}` : ""}
            </p>
          </div>
        </div>
        <p className="flex shrink-0 items-center gap-2 self-start rounded-lg bg-muted px-3 py-2 text-sm font-medium text-primary sm:self-auto">
          <ClipboardList aria-hidden="true" className="size-4" />
          {total} {total === 1 ? "registro" : "registros"}
        </p>
      </header>

      <dl className="grid gap-5 py-6 sm:grid-cols-2 lg:grid-cols-4">
        <Detalhe rotulo="Telefone" valor={cliente.numeroTelefone} />
        <Detalhe rotulo="Endereço" valor={cliente.endereco} />
        <Detalhe rotulo="Peso" valor={cliente.peso != null ? `${cliente.peso} kg` : null} />
        <Detalhe rotulo="Altura" valor={cliente.altura != null ? `${cliente.altura} cm` : null} />
        {cliente.descricao && (
          <div className="sm:col-span-2 lg:col-span-4">
            <Detalhe rotulo="Descrição" valor={cliente.descricao} />
          </div>
        )}
      </dl>

      <div className="space-y-8 border-t border-border pt-6">
        {categorias.map(({ id, titulo, icon: Icon, vazio }) => (
          <section key={id} aria-labelledby={`${id}-cliente-${cliente.id}`}>
            <div className="mb-4 flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-primary">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <h3
                id={`${id}-cliente-${cliente.id}`}
                className="font-heading text-xl font-semibold text-primary"
              >
                {titulo}
                <span className="ml-2 font-body text-sm font-normal text-muted-foreground">
                  ({registros[id].length})
                </span>
              </h3>
            </div>
            {registros[id].length === 0 ? (
              <p className="rounded-lg bg-background p-4 text-sm leading-6 text-muted-foreground">
                {vazio}
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {registros[id].map((registro) => (
                  <CartaoRegistro key={registro.id} categoria={id} registro={registro} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}

export function ClientesCaregiver() {
  const [searchParams] = useSearchParams();

  return searchParams.get("buscar") === "1"
    ? <PesquisarClientesCaregiver />
    : <MeusClientesCaregiver />;
}

function MeusClientesCaregiver() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);
  const destino = obterDestinoDaSessao();

  useEffect(() => {
    if (destino !== "/HomeCaregiver") return;
    const controller = new AbortController();

    async function carregar() {
      setCarregando(true);
      setErro("");

      try {
        const { data } = await api.get("/api/clientes/meus", {
          signal: controller.signal,
        });
        if (!Array.isArray(data)) throw new Error("Resposta inválida da API.");
        if (!controller.signal.aborted) setClientes(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          setErro(error.response?.status === 401
            ? "Sua sessão expirou. Saia da conta e entre novamente."
            : "Não foi possível carregar seus clientes e registros. Tente novamente.");
        }
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    carregar();
    return () => controller.abort();
  }, [destino, tentativa]);

  if (!destino) return <Navigate to="/login" replace />;
  if (destino !== "/HomeCaregiver") return <Navigate to={destino} replace />;

  return (
    <div className="min-h-screen bg-background">
      <NavBarCaregiver />
      <PageIntro
        eyebrow="Pessoas acompanhadas"
        title="Meus clientes"
        text="Consulte os clientes vinculados a você e todos os registros de saúde de cada um."
      />
      <main
        aria-label="Clientes e registros de saúde"
        aria-busy={carregando}
        className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"
      >
        {carregando ? (
          <p role="status" className="py-12 text-center text-muted-foreground">
            Carregando seus clientes e registros...
          </p>
        ) : erro ? (
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <p role="alert" className="text-destructive">{erro}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setTentativa((atual) => atual + 1)}
              className="mt-4 min-h-12"
            >
              <RotateCcw aria-hidden="true" />
              Tentar novamente
            </Button>
          </div>
        ) : clientes.length === 0 ? (
          <div role="status" className="rounded-lg border border-border bg-card px-5 py-12 text-center">
            <Users aria-hidden="true" className="mx-auto size-10 text-primary" />
            <h2 className="mt-4 font-heading text-2xl font-semibold text-primary">
              Você ainda não possui clientes vinculados
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Quando um cliente estiver vinculado a você, ele e seus registros aparecerão aqui.
            </p>
          </div>
        ) : (
          <>
            <p role="status" className="mb-5 text-sm text-muted-foreground">
              {clientes.length} {clientes.length === 1 ? "cliente vinculado" : "clientes vinculados"}
            </p>
            <div className="space-y-6 sm:space-y-8">
              {clientes.map(({ cliente, registros }) => (
                <CartaoCliente key={cliente.id} cliente={cliente} registros={registros} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
