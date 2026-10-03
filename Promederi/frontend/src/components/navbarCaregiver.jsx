import React from "react";
const _jsxFileName = "";import { Link, useLocation } from "react-router-dom";
import { House, UserRound, Users } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

const links = [
  { to: "/HomeCaregiver", label: "Plantão", icon: House },
  { to: "/ClientesCaregiver", label: "Clientes e anotações", icon: Users },
  { to: "/PerfilCaregiver", label: "Meu perfil", icon: UserRound },
] ;

export function NavBarCaregiver() {
  const location = useLocation();
  return (
    React.createElement('header', { className: "border-b border-primary/15 bg-primary text-primary-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}
      , React.createElement('div', { className: "mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}
        , React.createElement(Link, { to: "/HomeCaregiver", className: "[&_span]:text-primary-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 15}}, React.createElement(BrandLogo, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 15}} ))
        , React.createElement('nav', { 'aria-label': "Navegação do cuidador"  , className: "flex gap-1 overflow-x-auto pb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}
          , links.map(({ to, label, icon: Icon }) => (
            React.createElement(Link, { key: to, to: to, className: `flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-4 text-sm font-medium hover:bg-primary-foreground/10 ${location.pathname === to ? "bg-primary-foreground/15" : ""}`         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}
              , React.createElement(Icon, { 'aria-hidden': "true", className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}} ), label
            )
          ))
          , React.createElement(Link, { to: "/", className: "min-h-11 shrink-0 rounded-lg px-4 py-3 text-sm font-medium text-highlight hover:bg-primary-foreground/10"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}, "Visão do familiar"  )
        )
      )
    )
  );
}