import { Link, Navigate } from "react-router-dom";
import { ArrowRight, Search, UserRound, Users } from "lucide-react";
import { NavBarCaregiver } from "@/components/navbarCaregiver";
import { Button } from "@/components/ui/button";
import { obterDestinoDaSessao } from "@/lib/session";

const acoes = [
  { titulo: "Meus clientes", descricao: "Acesse seus clientes e acompanhe as informações e anotações de cada atendimento.", acao: "Ver meus clientes", rota: "/ClientesCaregiver", icon: Users },
  { titulo: "Procurar um cliente", descricao: "Encontre um cliente pelo nome para consultar seu acompanhamento com mais facilidade.", acao: "Procurar cliente", rota: "/ClientesCaregiver?buscar=1", icon: Search },
  { titulo: "Meu perfil", descricao: "Acesse sua apresentação e as informações profissionais do seu perfil de cuidador.", acao: "Ver meu perfil", rota: "/PerfilCaregiver", icon: UserRound },
];

export function HomeCaregiver() {
  const destino = obterDestinoDaSessao();
  if (!destino) return <Navigate to="/login" replace />;
  if (destino !== "/HomeCaregiver") return <Navigate to={destino} replace />;

  const usuario = JSON.parse(sessionStorage.getItem("usuario"));
  const primeiroNome = usuario.nome?.trim().split(/\s+/)[0] || "cuidador";

  return (
    <div className="min-h-screen bg-background">
      <NavBarCaregiver />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        <header className="border-b border-border pb-8 sm:pb-10">
          <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight text-primary sm:text-5xl">Boas-vindas, {primeiroNome}!</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Organize seu acompanhamento em um só lugar. Acesse seus clientes, encontre um atendimento ou consulte seu perfil.</p>
        </header>

        <section aria-labelledby="acoes-cuidador-titulo" className="pt-8 sm:pt-10">
          <div className="mb-5">
            <h2 id="acoes-cuidador-titulo" className="font-heading text-2xl font-semibold text-primary sm:text-3xl">Como deseja começar?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">Escolha uma opção para continuar sua rotina de cuidado.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
            {acoes.map(({ titulo, descricao, acao, rota, icon: Icon }) => (
              <article key={titulo} className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-5 shadow-soft sm:p-6">
                <span className="grid size-12 place-items-center rounded-lg bg-muted text-primary"><Icon aria-hidden="true" className="size-6" /></span>
                <h3 className="mt-5 font-heading text-xl font-semibold text-primary">{titulo}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{descricao}</p>
                <Button asChild className="mt-6 min-h-12 w-full justify-between px-4 text-sm sm:text-base"><Link to={rota}><span>{acao}</span><ArrowRight aria-hidden="true" className="size-4" /></Link></Button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
