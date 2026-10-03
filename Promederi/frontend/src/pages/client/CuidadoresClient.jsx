import React from "react";
const _jsxFileName = "";import { useState } from "react";
import { BadgeCheck, CalendarDays, MapPin, MessageCircle, Search, Star } from "lucide-react";
import lucianaPhoto from "@/assets/luciana-ribeiro.jpg";
import { NavBarClient } from "@/components/NavBarClient";
import { Button } from "@/components/ui/button";

const caregivers = [
  { name: "Ana Paula Martins", role: "Cuidadora noturna", rating: "4,8", tags: "Noite • Alzheimer • Banho assistido", area: "Até 4 km" },
  { name: "Roberta Nunes", role: "Técnica de enfermagem", rating: "4,9", tags: "Medicação • Pós-operatório • Finais de semana", area: "Até 7 km" },
  { name: "Carla Azevedo", role: "Cuidadora diarista", rating: "4,7", tags: "Companhia • Mobilidade • Rotina alimentar", area: "Até 5 km" },
];

export function CuidadoresClient() {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const visibleCaregivers = caregivers.filter((caregiver) =>
    `${caregiver.name} ${caregiver.role} ${caregiver.tags} ${caregiver.area}`.toLowerCase().includes(normalizedSearch),
  );

  return (
    React.createElement('div', { className: "min-h-screen bg-background" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}
      , React.createElement(NavBarClient, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 22}} )
      , React.createElement(PageIntro, { eyebrow: "Rede de cuidado"  , title: "Cuidadores de Helena"  , text: "Acompanhe profissionais, horários, comunicação e encontre reforços quando precisar."        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}} )
      , React.createElement('main', { className: "mx-auto grid max-w-7xl gap-6 px-5 pb-16 lg:grid-cols-[1.35fr_1fr] lg:px-8"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}
        , React.createElement('section', { className: "rounded-lg border border-border bg-card p-7 shadow-soft"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}
          , React.createElement('div', { className: "grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}}
            , React.createElement('img', { src: lucianaPhoto, alt: "Luciana Ribeiro" , width: 816, height: 816, className: "size-24 rounded-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 27}} )
            , React.createElement('div', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}
              , React.createElement('span', { className: "text-xs font-semibold text-success"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}, "EM PLANTÃO" )
              , React.createElement('h2', { className: "mt-1 font-heading text-2xl font-semibold text-primary"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}}, "Luciana Ribeiro" )
              , React.createElement('p', { className: "mt-1 text-sm text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 31}}, "Cuidadora sênior • 8 anos de experiência"      )
              , React.createElement('p', { className: "mt-3 flex flex-wrap items-center gap-2 text-sm text-foreground"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}}
                , React.createElement(Star, { className: "size-4 fill-highlight text-emergency"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}} ), " 4,9 • Verificada "    , React.createElement(BadgeCheck, { className: "size-4 text-success" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}} )
              )
            )
          )
          , React.createElement('div', { className: "mt-6 flex flex-wrap gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 37}}
            , React.createElement(Button, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 38}}, React.createElement(MessageCircle, { className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 38}} ), " Enviar mensagem"  )
            , React.createElement(Button, { variant: "secondary", __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}}, React.createElement(CalendarDays, { className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}} ), " Ver escala"  )
          )
        )

        , React.createElement('aside', { className: "rounded-lg bg-primary p-7 text-primary-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 43}}
          , React.createElement('h2', { className: "font-heading text-2xl font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}, "Cobertura da semana"  )
          , React.createElement('p', { className: "mt-2 text-sm text-primary-foreground/70"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}, "Todos os turnos estão cobertos."    )
          , React.createElement('div', { className: "mt-6 space-y-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}, ["Hoje • 08h às 18h", "Quarta • 08h às 18h", "Quinta • 12h às 20h"].map((item) => React.createElement('div', { key: item, className: "rounded-lg bg-primary-foreground/10 p-4 text-sm"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}, item)))
        )

        , React.createElement('section', { className: "rounded-lg border border-border bg-card p-7 shadow-soft lg:col-span-2"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}
          , React.createElement('div', { className: "grid gap-4 border-b border-border pb-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}
            , React.createElement('div', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}
              , React.createElement('p', { className: "text-sm font-semibold text-emergency"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}, "Encontrar outro cuidador"  )
              , React.createElement('h2', { className: "mt-1 font-heading text-3xl font-semibold text-primary"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}, "Busca por profissionais"  )
              , React.createElement('p', { className: "mt-2 max-w-2xl text-sm leading-6 text-muted-foreground"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}, "Use a busca para localizar cuidadores por disponibilidade, especialidade ou região."          )
            )
            , React.createElement(Button, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}, "Publicar solicitação" )
          )

          , React.createElement('label', { className: "mt-6 flex min-h-12 items-center gap-3 rounded-lg border border-border bg-background px-4"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}
            , React.createElement(Search, { className: "size-5 shrink-0 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}} )
             , React.createElement('input', { value: search, onChange: (event) => setSearch(event.target.value), 'aria-label': "Buscar cuidadores" , placeholder: "Buscar por nome, especialidade ou bairro"     , className: "w-full min-w-0 bg-transparent text-sm outline-hidden placeholder:text-muted-foreground"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}} )
          )

          , React.createElement('div', { className: "mt-5 grid gap-4 lg:grid-cols-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
            , visibleCaregivers.map((caregiver) => (
              React.createElement('article', { key: caregiver.name, className: "rounded-lg border border-border bg-background p-5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}
                , React.createElement('p', { className: "text-xs font-semibold text-success"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}, "DISPONÍVEL")
                , React.createElement('h3', { className: "mt-2 font-heading text-xl font-semibold text-primary"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}, caregiver.name)
                , React.createElement('p', { className: "mt-1 text-sm text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}, caregiver.role)
                , React.createElement('p', { className: "mt-3 flex items-center gap-2 text-sm text-foreground"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}, React.createElement(Star, { className: "size-4 fill-highlight text-emergency"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}} ), " " , caregiver.rating, " • "  , caregiver.tags)
                , React.createElement('p', { className: "mt-3 flex items-center gap-2 text-sm text-muted-foreground"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}, React.createElement(MapPin, { className: "size-4 text-emergency" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}} ), " " , caregiver.area)
                , React.createElement(Button, { variant: "secondary", className: "mt-5 w-full" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}, "Ver perfil" )
              )
            ))
          )
          , visibleCaregivers.length === 0 && (
            React.createElement('div', { className: "mt-5 rounded-lg border border-border bg-background p-6 text-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}
              , React.createElement('p', { className: "font-heading text-xl font-semibold text-primary"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}, "Nenhum cuidador encontrado"  )
              , React.createElement('p', { className: "mt-2 text-sm text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}, "Tente buscar por outra especialidade, região ou nome."       )
            )
          )
        )
      )
    )
  );
}

export function PageIntro({ eyebrow, title, text }) {
  return React.createElement('header', { className: "mx-auto max-w-7xl px-5 pb-8 pt-10 lg:px-8"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}, React.createElement('p', { className: "text-sm font-semibold text-emergency"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}, eyebrow), React.createElement('h1', { className: "mt-2 font-heading text-4xl font-semibold text-primary sm:text-5xl"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}, title), React.createElement('p', { className: "mt-3 max-w-2xl text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}, text));
}