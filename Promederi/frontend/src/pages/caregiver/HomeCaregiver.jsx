import React from "react";
const _jsxFileName = "";import { Bot, CheckCircle2, Clock3, UserRoundCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import helenaPhoto from "@/assets/helena-soares.jpg";
import { NavBarCaregiver } from "@/components/NavBarCaregiver";
import { Button } from "@/components/ui/button";

export function HomeCaregiver() {
  return (
    React.createElement('div', { className: "min-h-screen bg-background" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9}}
      , React.createElement(NavBarCaregiver, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10}} )
      , React.createElement('main', { className: "mx-auto max-w-7xl px-5 py-10 lg:px-8"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}}
        , React.createElement('p', { className: "text-sm font-semibold text-emergency"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}, "PLANTÃO EM ANDAMENTO"  )
        , React.createElement('h1', { className: "mt-2 font-heading text-4xl font-semibold text-primary"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}, "Bom dia, Luciana."  )
        , React.createElement('p', { className: "mt-2 max-w-2xl text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}, "Sua prioridade agora é acompanhar Helena, registrar observações por cliente e manter a família atualizada."              )

        , React.createElement('div', { className: "mt-8 grid gap-6 lg:grid-cols-[1fr_1.6fr]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}
          , React.createElement('section', { className: "rounded-lg border border-border bg-card p-7 shadow-soft"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}
            , React.createElement('img', { src: helenaPhoto, alt: "Helena Soares" , width: 816, height: 816, className: "size-24 rounded-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}} )
            , React.createElement('h2', { className: "mt-4 font-heading text-2xl font-semibold text-primary"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}}, "Helena Soares" )
            , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}, "Plantão das 08h às 18h"    )
            , React.createElement('div', { className: "mt-6 grid gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}
              , React.createElement(Button, { className: "w-full", __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}, React.createElement(UserRoundCheck, { className: "size-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}} ), " Registrar check-in"  )
              , React.createElement(Button, { asChild: true, variant: "secondary", className: "w-full", __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}}
                , React.createElement(Link, { to: "/ClientesCaregiver", __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}, React.createElement(Users, { className: "size-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}} ), " Ver cliente e anotações"    )
              )
              , React.createElement(Button, { asChild: true, variant: "secondary", className: "w-full", __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}}
                , React.createElement(Link, { to: "/ClientesCaregiver", __self: this, __source: {fileName: _jsxFileName, lineNumber: 27}}, React.createElement(Bot, { className: "size-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 27}} ), " Usar IA contratada"   )
              )
            )
          )

          , React.createElement('section', { className: "rounded-lg border border-border bg-card p-7 shadow-soft"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}}
            , React.createElement('h2', { className: "font-heading text-2xl font-semibold text-primary"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}}, "Próximos cuidados" )
            , React.createElement('div', { className: "mt-6 space-y-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}}
              , React.createElement(CareTask, { icon: CheckCircle2, time: "08:00", title: "Losartana 50 mg"  , done: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}} )
              , React.createElement(CareTask, { icon: Clock3, time: "10:30", title: "Hidratação", __self: this, __source: {fileName: _jsxFileName, lineNumber: 36}} )
              , React.createElement(CareTask, { icon: Clock3, time: "13:30", title: "Caminhada assistida" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 37}} )
            )
          )
        )
      )
    )
  );
}

function CareTask({ icon: Icon, time, title, done = false }) {
  return React.createElement('div', { className: "grid min-h-16 grid-cols-[auto_3.5rem_minmax(0,1fr)_auto] items-center gap-4 rounded-lg bg-background p-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}, React.createElement(Icon, { className: done ? "size-5 text-success" : "size-5 text-emergency", __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}} ), React.createElement('span', { className: "text-sm font-semibold text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}, time), React.createElement('span', { className: "min-w-0 truncate font-medium text-primary"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}, title), React.createElement('span', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}, done ? "Concluído" : "Pendente"));
}