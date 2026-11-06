import React from "react";
const _jsxFileName = "";import { useState } from "react";
import { Bot, ClipboardList, History, Send, ShieldAlert, Stethoscope, UserRound } from "lucide-react";
import { NavBarClient } from "@/components/NavBarClient";
import { Button } from "@/components/ui/button";
import { PageIntro } from "./CuidadoresClient";

const quickReports = [
  "Tontura",
  "Náusea",
  "Dor de cabeça",
];

const historyItems = [
  "Pressão estável nas últimas medições",
  "Losartana administrada às 08:00",
  "Histórico de desconforto no joelho direito",
];

export function IAClient() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    if (message.trim()) setSent(true);
  };

  const chooseReport = (report) => {
    setMessage(report);
    setSent(false);
  };

  return (
    React.createElement('div', { className: "min-h-screen bg-background" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}}
      , React.createElement(NavBarClient, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 35}} )
      , React.createElement(PageIntro, {
        eyebrow: "Orientação inicial" ,
        title: "IA de saúde"  ,
        text: "Descreva uma alteração percebida e receba uma orientação inicial baseada no histórico de Helena."             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 36}}
      )

      , React.createElement('main', { className: "mx-auto grid max-w-7xl items-start gap-6 px-5 pb-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}}
        , React.createElement('section', { className: "rounded-lg border border-border bg-card p-5 shadow-soft sm:p-7"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 43}}
          , React.createElement('div', { className: "grid gap-5 border-b border-border pb-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}
            , React.createElement('div', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}
              , React.createElement('p', { className: "flex items-center gap-2 text-sm font-semibold text-emergency"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}
                , React.createElement(Stethoscope, { className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}} ), " Assistente Promedéri"
              )
              , React.createElement('h2', { className: "mt-2 font-heading text-3xl font-semibold text-primary"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}, "Relato de sintomas"  )
              , React.createElement('p', { className: "mt-2 max-w-2xl text-sm leading-6 text-muted-foreground"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}, "Escreva de forma simples o que mudou. A resposta organiza o risco, possíveis causas e próximos cuidados."

              )
            )
            , React.createElement('div', { className: "flex items-center gap-3 rounded-lg bg-background px-4 py-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}
              , React.createElement(UserRound, { className: "size-5 text-emergency" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 55}} )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}
                , React.createElement('p', { className: "text-sm font-semibold text-primary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}, "Helena Soares" )
                , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}, "84 anos • histórico ativo"    )
              )
            )
          )

          , React.createElement('div', { className: "mt-6 space-y-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}
            , React.createElement('div', { className: "grid grid-cols-[auto_minmax(0,1fr)] gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
              , React.createElement('span', { className: "grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-primary"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
                , React.createElement(Bot, { className: "size-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}} )
              )
              , React.createElement('p', { className: "rounded-lg bg-background p-4 text-sm leading-6 text-foreground"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}, "Olá! Conte o que você percebeu hoje e informe horário, intensidade e se já aconteceu antes."

              )
            )

            , sent && (
              React.createElement('div', { className: "ml-auto max-w-2xl rounded-lg bg-muted p-4 text-sm leading-6 text-primary"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}
                , React.createElement('p', { className: "font-semibold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}, "Relato recebido" )
                , React.createElement('p', { className: "mt-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}, message)
                , React.createElement('div', { className: "mt-4 grid gap-2 border-t border-primary/15 pt-4 text-muted-foreground"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}
                  , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}, "Prioridade: observar evolução nas próximas horas."     )
                  , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}, "Próximo passo: registrar sinais associados e avisar a cuidadora se houver piora."           )
                )
              )
            )
          )

          , React.createElement('div', { className: "mt-7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
            , React.createElement('p', { className: "text-sm font-semibold text-primary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}, "Relatos rápidos" )
            , React.createElement('div', { className: "mt-3 flex flex-wrap gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}
              , quickReports.map((report) => (
                React.createElement(Button, { key: report, type: "button", variant: "secondary", size: "sm", onClick: () => chooseReport(report), __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}
                  , report
                )
              ))
            )
          )

          , React.createElement('form', { onSubmit: submit, className: "mt-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}
            , React.createElement('label', { className: "block text-sm font-medium text-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 97}}, "Descreva o sintoma"

              , React.createElement('textarea', {
                value: message,
                onChange: (event) => {
                  setMessage(event.target.value);
                  setSent(false);
                },
                placeholder: "Ex.: Helena sentiu tontura ao se levantar por volta das 10h..."          ,
                className: "mt-2 min-h-32 w-full resize-none rounded-lg border border-input bg-background p-4 text-sm outline-hidden focus:border-primary focus:ring-3 focus:ring-primary/15"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
              )
            )
            , React.createElement(Button, { type: "submit", disabled: !message.trim(), className: "mt-3 min-h-12 sm:ml-auto sm:flex"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}}
              , React.createElement(Send, { className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}} ), " Analisar relato"
            )
          )
        )

        , React.createElement('aside', { className: "space-y-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
          , React.createElement('section', { className: "rounded-lg bg-primary p-6 text-primary-foreground shadow-brand"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}
            , React.createElement('div', { className: "flex items-start gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
              , React.createElement(ShieldAlert, { className: "mt-0.5 size-5 shrink-0 text-highlight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}} )
              , React.createElement('p', { className: "text-sm leading-6 text-primary-foreground/80"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}, "As respostas não substituem diagnóstico ou prescrição de um profissional de saúde. Em caso de risco imediato, procure atendimento."

              )
            )
          )

          , React.createElement('section', { className: "rounded-lg border border-border bg-card p-6 shadow-soft"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}
            , React.createElement('p', { className: "flex items-center gap-2 text-sm font-semibold text-primary"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}
              , React.createElement(ClipboardList, { className: "size-4 text-emergency" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}} ), " Como utilizar o relato de sintomas.\n Informe:"
            )
            , React.createElement('ul', { className: "mt-4 space-y-3 text-sm leading-6 text-muted-foreground"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}
              , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}, "O que você sente ou sentiu."   )
              , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}, "Intensidade e duração."  )
              , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 145}}, "Medicamentos, alimentação e atividades recentes."    )
            )
          )
        )
      )
    )
  );
}
