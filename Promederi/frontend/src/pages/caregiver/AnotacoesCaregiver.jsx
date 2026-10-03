import React from "react";
const _jsxFileName = "";import { Link } from "react-router-dom";
import { ClipboardCheck, Users } from "lucide-react";
import { NavBarCaregiver } from "@/components/NavBarCaregiver";
import { Button } from "@/components/ui/button";
import { PageIntro } from "../client/CuidadoresClient";

const registros = [
  { hora: "10:20", texto: "Hidratação confirmada: Helena tomou um copo de água." },
  { hora: "08:45", texto: "Paciente acordou bem-disposta e aceitou o café da manhã." },
];

export function AnotacoesCaregiver() {
  return (
    React.createElement('div', { className: "min-h-screen bg-background" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}
      , React.createElement(NavBarCaregiver, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 15}} )
      , React.createElement(PageIntro, { eyebrow: "Registro de plantão"  , title: "Anotações por cliente"  , text: "As anotações agora ficam organizadas junto de cada cliente para facilitar o acompanhamento."            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}} )
      , React.createElement('main', { className: "mx-auto max-w-5xl px-5 pb-16 lg:px-8"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}
        , React.createElement('div', { className: "mb-6 rounded-lg bg-primary p-6 text-primary-foreground shadow-brand"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}
          , React.createElement('p', { className: "font-heading text-2xl font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}}, "Clientes e anotações foram unificados"    )
          , React.createElement('p', { className: "mt-2 text-sm leading-6 text-primary-foreground/75"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}, "Abra a área de clientes para ver cada pessoa acompanhada, seus registros do dia e o acesso à IA quando contratado."                    )
          , React.createElement(Button, { asChild: true, variant: "secondary", className: "mt-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}
            , React.createElement(Link, { to: "/ClientesCaregiver", __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}, React.createElement(Users, { className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}} ), " Ir para clientes"   )
          )
        )
        , React.createElement('div', { className: "grid gap-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}
          , registros.map((registro) => (
            React.createElement('article', { key: registro.hora, className: "flex gap-4 rounded-lg border border-border bg-card p-6 shadow-soft"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 27}}
              , React.createElement('span', { className: "grid size-10 shrink-0 place-items-center rounded-lg bg-success-soft text-success"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}, React.createElement(ClipboardCheck, { className: "size-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}} ))
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}, React.createElement('p', { className: "text-xs font-semibold text-emergency"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}, "HOJE • "  , registro.hora), React.createElement('p', { className: "mt-2 leading-7 text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}, registro.texto))
            )
          ))
        )
      )
    )
  );
}