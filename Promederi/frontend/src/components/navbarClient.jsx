import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpenText, Bot, ClipboardList, HeartPulse, Menu, Users, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { Button } from "./ui/button";
import api from "@/services/api.service";

const links = [
  { to: "/HomeClient", label: "Visão geral", icon: HeartPulse },
  { to: "/RegistrosClient", label: "Registros", icon: ClipboardList },
  { to: "/CuidadoresClient", label: "Cuidadores", icon: Users },
  { to: "/AnotacoesClient", label: "Anotações", icon: BookOpenText },
  { to: "/IAClient", label: "IA de saúde", icon: Bot },
];

function obterNomeUsuario() {
  try {
    const usuario = JSON.parse(sessionStorage.getItem("usuario") || "null");
    return String(usuario?.nome || "").trim() || "Usuário";
  } catch {
    return "Usuário";
  }
}

function IdentidadeUsuario({ nome, className = "" }) {
  const inicial = Array.from(nome)[0].toLocaleUpperCase("pt-BR");

  return (
    <div className={`flex min-w-0 items-center gap-2.5 ${className}`}>
      <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-highlight/35 font-heading text-lg font-bold text-primary ring-1 ring-border">
        {inicial}
      </span>
      <span className="min-w-0 break-words text-sm font-semibold text-primary sm:truncate" title={nome}>{nome}</span>
    </div>
  );
}

export function NavBarClient() {
  const [open, setOpen] = useState(false);
  const [nomeUsuario] = useState(obterNomeUsuario);
  const location = useLocation();
  const navigate = useNavigate();

  function sair() {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("usuario");
    delete api.defaults.headers.common.Authorization;
    setOpen(false);
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-8">
          {location.pathname === "/HomeClient" ? (
            <span className="shrink-0"><BrandLogo /></span>
          ) : (
            <Link to="/HomeClient" aria-label="Promedéri — início" className="shrink-0"><BrandLogo /></Link>
          )}
          <nav aria-label="Navegação do cliente" className="hidden items-center gap-6 xl:flex">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                aria-current={location.pathname === to ? "page" : undefined}
                className={`flex min-h-11 items-center gap-2 border-b-2 px-1 text-sm font-medium transition-colors hover:text-primary ${location.pathname === to ? "border-emergency text-primary" : "border-transparent text-muted-foreground"}`}
              >
                <Icon aria-hidden="true" className="size-4" />{label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="ml-auto hidden min-w-0 items-center gap-3 sm:flex">
          <IdentidadeUsuario nome={nomeUsuario} className="max-w-40" />
          <Button type="button" onClick={sair} className="min-h-11 shrink-0 px-5">Sair</Button>
        </div>
        <Button type="button" variant="ghost" className="size-11 shrink-0 px-0 xl:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>
          {open ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}
        </Button>
      </div>
      {open && (
        <nav aria-label="Navegação móvel" className="border-t border-border bg-card p-4 xl:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {links.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setOpen(false)} aria-current={location.pathname === to ? "page" : undefined} className="flex min-h-12 items-center gap-3 rounded-lg px-4 text-sm font-medium text-foreground hover:bg-accent">
                <Icon aria-hidden="true" className="size-5 text-primary" />{label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-3 border-t border-border pt-4 sm:hidden">
              <IdentidadeUsuario nome={nomeUsuario} className="flex-1" />
              <Button type="button" variant="outline" onClick={sair} className="min-h-12 shrink-0">Sair</Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
