import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="relative hidden h-[84px] w-full items-center bg-[#516FA4] px-8 shadow-lg md:flex">
        
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#D9D9D9]" />
          <span className="text-[18px] font-semibold text-white">
            Promederi
          </span>
        </Link>

        {/* LINKS */}
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-10">
          <Link
            to="/"
            className="whitespace-nowrap text-[16px] font-semibold text-white/90 transition hover:text-white"
          >
            Página inicial
          </Link>
          <Link
            to="/cuidadoresClient"
            className="whitespace-nowrap text-[16px] font-semibold text-white/90 transition hover:text-white"
          >
            Buscar cuidadores
          </Link>
          <Link
            to="/anotacaoClient"
            className="whitespace-nowrap text-[16px] font-semibold text-white/90 transition hover:text-white"
          >
            Anotação
          </Link>
          <Link
            to="/IAClient"
            className="whitespace-nowrap text-[16px] font-semibold text-white/90 transition hover:text-white"
          >
            Funções de IA
          </Link>
        </div>

        {/* USUÁRIO */}
        <div className="ml-auto">
          <Link to="/perfilClient" className="text-[16px] font-semibold text-white hover:underline">
            Nome
          </Link>
        </div>
      </nav>

      {/* MOBILE */}
      <header className="flex h-[64px] w-full items-center justify-between bg-[#516FA4] px-5 shadow-lg md:hidden">
        <Link to="/" className="text-[17px] font-semibold text-white">
          Promederi
        </Link>

        {/* Hambúrguer */}
        <button
          onClick={() => setMenuOpen(true)}
          className="flex flex-col gap-[5px]"
          aria-label="Abrir menu"
        >
          <span className="h-[2px] w-7 bg-white" />
          <span className="h-[2px] w-7 bg-white" />
          <span className="h-[2px] w-7 bg-white" />
        </button>
      </header>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* SIDEBAR MOBILE / TABLET */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[150px] bg-[#516FA4] shadow-xl transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Botão fechar */}
        <div className="flex justify-end border-b border-[#314362] px-3 py-4">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-2xl leading-none text-white"
            aria-label="Fechar menu"
          >
            ×
          </button>
        </div>

        {/* MENU MOBILE */}
        <div className="flex flex-col">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="border-b border-[#6B87B5] px-2 py-3 text-[15px] text-white transition hover:bg-[#466394]"
          >
            Página inicial
          </Link>
          <Link
            to="/cuidadoresClient"
            onClick={() => setMenuOpen(false)}
            className="border-b border-[#6B87B5] px-2 py-3 text-[15px] text-white transition hover:bg-[#466394]"
          >
            Buscar cuidadores
          </Link>
          <Link
            to="/anotacaoClient"
            onClick={() => setMenuOpen(false)}
            className="border-b border-[#6B87B5] px-2 py-3 text-[15px] text-white transition hover:bg-[#466394]"
          >
            Anotação
          </Link>
          <Link
            to="/IAClient"
            onClick={() => setMenuOpen(false)}
            className="border-b border-[#6B87B5] px-2 py-3 text-[15px] text-white transition hover:bg-[#466394]"
          >
            Funções de IA
          </Link>
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="px-2 py-3 text-[15px] text-white transition hover:bg-[#466394]"
          >
            Sair
          </Link>
        </div>
      </aside>
    </>
  );
}