import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HeartPulse, Menu, Search, UserRound, Users, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { Button } from "./ui/button";
import api from "@/services/api.service";

const links = [
  { to: "/HomeCaregiver", label: "Visão geral", icon: HeartPulse },
  { to: "/ClientesCaregiver", label: "Meus clientes", icon: Users },
  { to: "/ClientesCaregiver?buscar=1", label: "Procurar um cliente", icon: Search },
  { to: "/PerfilCaregiver", label: "Meu perfil", icon: UserRound },
];

function obterNome() {
  try { return String(JSON.parse(sessionStorage.getItem("usuario"))?.nome || "Cuidador").trim() || "Cuidador"; }
  catch { return "Cuidador"; }
}

export function NavBarCaregiver() {
  const [open, setOpen] = useState(false);
  const [nome] = useState(obterNome);
  const location = useLocation();
  const navigate = useNavigate();
  const buscando = new URLSearchParams(location.search).get("buscar") === "1";

  function estaAtivo(to) {
    if (to.startsWith("/ClientesCaregiver")) return location.pathname === "/ClientesCaregiver" && buscando === to.includes("?buscar=1");
    return location.pathname === to;
  }

  function sair() {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("usuario");
    delete api.defaults.headers.common.Authorization;
    setOpen(false);
    navigate("/login", { replace: true });
  }

  const identidade = <><span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-highlight/35 font-heading text-lg font-bold text-primary ring-1 ring-border">{Array.from(nome)[0].toLocaleUpperCase("pt-BR")}</span><span className="min-w-0 truncate text-sm font-semibold text-primary" title={nome}>{nome}</span></>;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-8">
          <Link to="/HomeCaregiver" aria-label="Promedéri — início do cuidador" className="shrink-0"><BrandLogo /></Link>
          <nav aria-label="Navegação do cuidador" className="hidden items-center gap-6 xl:flex">
            {links.map(({ to, label, icon: Icon }) => <Link key={to} to={to} aria-current={estaAtivo(to) ? "page" : undefined} className={`flex min-h-11 items-center gap-2 border-b-2 px-1 text-sm font-medium transition-colors hover:text-primary ${estaAtivo(to) ? "border-emergency text-primary" : "border-transparent text-muted-foreground"}`}><Icon aria-hidden="true" className="size-4" />{label}</Link>)}
          </nav>
        </div>
        <div className="ml-auto hidden min-w-0 items-center gap-3 sm:flex"><div className="flex min-w-0 max-w-40 items-center gap-2.5">{identidade}</div><Button type="button" onClick={sair} className="min-h-11 shrink-0 px-5">Sair</Button></div>
        <Button type="button" variant="ghost" className="size-11 shrink-0 px-0 xl:hidden" onClick={() => setOpen((atual) => !atual)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>{open ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}</Button>
      </div>
      {open && <nav aria-label="Navegação móvel do cuidador" className="border-t border-border bg-card p-4 xl:hidden"><div className="mx-auto grid max-w-7xl gap-2">
        {links.map(({ to, label, icon: Icon }) => <Link key={to} to={to} onClick={() => setOpen(false)} aria-current={estaAtivo(to) ? "page" : undefined} className={`flex min-h-12 items-center gap-3 rounded-lg px-4 text-sm font-medium hover:bg-accent ${estaAtivo(to) ? "bg-accent text-primary" : "text-foreground"}`}><Icon aria-hidden="true" className="size-5 text-primary" />{label}</Link>)}
        <div className="mt-2 flex items-center gap-3 border-t border-border pt-4 sm:hidden"><div className="flex min-w-0 flex-1 items-center gap-2.5">{identidade}</div><Button type="button" variant="outline" onClick={sair} className="min-h-12 shrink-0">Sair</Button></div>
      </div></nav>}
    </header>
  );
}
