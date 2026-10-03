import React from "react";
const _jsxFileName = "";import { Link, useLocation } from "react-router-dom";
import { BookOpenText, Bot, HeartPulse, Menu, Users, X } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { Button } from "./ui/button";

const links = [
  { to: "/", label: "Visão geral", icon: HeartPulse },
  { to: "/CuidadoresClient", label: "Cuidadores", icon: Users },
  { to: "/AnotacoesClient", label: "Anotações", icon: BookOpenText },
  { to: "/IAClient", label: "IA de saúde", icon: Bot },
] ;

export function NavBarClient() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    React.createElement('header', { className: "sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}
      , React.createElement('div', { className: "mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}}
        , React.createElement('div', { className: "flex items-center gap-10"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}
          , React.createElement(Link, { to: "/", 'aria-label': "Promedéri — início"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}, React.createElement(BrandLogo, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 21}} ))
          , React.createElement('nav', { 'aria-label': "Navegação do cliente"  , className: "hidden items-center gap-7 lg:flex"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}
            , links.map(({ to, label, icon: Icon }) => (
              React.createElement(Link, {
                key: to,
                to: to,
                className: `flex min-h-11 items-center gap-2 border-b-2 px-1 text-sm font-medium transition-colors hover:text-primary ${location.pathname === to ? "text-primary border-emergency" : "text-muted-foreground border-transparent"}`         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}

                , React.createElement(Icon, { 'aria-hidden': "true", className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}} ), label
              )
            ))
          )
        )
        , React.createElement('div', { className: "hidden items-center gap-3 sm:flex"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 37}}
          , React.createElement(Link, { to: "/HomeCaregiver", className: "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-primary"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 38}}, "Área do cuidador"

          )
          , React.createElement(Link, { to: "/login", className: "rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 41}}, "Sair")
        )
        , React.createElement(Button, { variant: "ghost", className: "size-11 px-0 lg:hidden"  , onClick: () => setOpen((value) => !value), 'aria-label': open ? "Fechar menu" : "Abrir menu", __self: this, __source: {fileName: _jsxFileName, lineNumber: 43}}
          , open ? React.createElement(X, { className: "size-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}} ) : React.createElement(Menu, { className: "size-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}} )
        )
      )
      , open && (
        React.createElement('nav', { 'aria-label': "Navegação móvel" , className: "border-t border-border bg-card p-4 lg:hidden"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}}
          , React.createElement('div', { className: "mx-auto grid max-w-7xl gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}
            , links.map(({ to, label, icon: Icon }) => (
              React.createElement(Link, { key: to, to: to, onClick: () => setOpen(false), className: "flex min-h-12 items-center gap-3 rounded-lg px-4 text-sm font-medium text-foreground hover:bg-accent"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}
                , React.createElement(Icon, { 'aria-hidden': "true", className: "size-5 text-primary" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}} ), label
              )
            ))
            , React.createElement(Link, { to: "/HomeCaregiver", onClick: () => setOpen(false), className: "min-h-12 rounded-lg px-4 py-3 text-sm font-medium text-primary hover:bg-accent"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 55}}, "Área do cuidador"  )
          )
        )
      )
    )
  );
}