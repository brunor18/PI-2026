import React from "react";
const _jsxFileName = ""; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useState } from "react";
import { ChevronDown, Plus, Search } from "lucide-react";
import { NavBarClient } from "@/components/NavBarClient";
import { Button } from "@/components/ui/button";
import { PageIntro } from "./CuidadoresClient";

const initialGroups = [
  {
    day: "Hoje, 22 de setembro",
    summary: "2 anotações",
    notes: [
      { time: "10:20", text: "Helena dormiu bem e acordou disposta.", author: "Luciana Ribeiro" },
      { time: "08:45", text: "Leve desconforto no joelho após a caminhada.", author: "Luciana Ribeiro" },
    ],
  },
  {
    day: "Ontem, 21 de setembro",
    summary: "3 anotações",
    notes: [
      { time: "18:10", text: "Jantou sopa e aceitou a medicação da noite.", author: "Marcos Soares" },
      { time: "14:30", text: "Fez repouso após a fisioterapia.", author: "Luciana Ribeiro" },
      { time: "09:05", text: "Pressão aferida dentro da normalidade.", author: "Luciana Ribeiro" },
    ],
  },
  {
    day: "20 de setembro",
    summary: "1 anotação",
    notes: [
      { time: "12:15", text: "Almoço completo e boa hidratação durante a manhã.", author: "Marcos Soares" },
    ],
  },
];

const defaultDay = _nullishCoalesce(_optionalChain([initialGroups, 'access', _ => _[0], 'optionalAccess', _2 => _2.day]), () => ( ""));

export function AnotacoesClient() {
  const [groups, setGroups] = useState(initialGroups);
  const [openDay, setOpenDay] = useState(defaultDay);
  const [search, setSearch] = useState("");

  const addNote = () => {
    setGroups((current) => current.map((group, index) => index === 0 ? {
      ...group,
      summary: `${group.notes.length + 1} anotações`,
      notes: [{ time: "Agora", text: "Nova observação registrada para acompanhamento.", author: "João Soares" }, ...group.notes],
    } : group));
    setOpenDay(defaultDay);
  };

  const normalizedSearch = search.trim().toLowerCase();
  const visibleGroups = groups.map((group) => ({
    ...group,
    notes: normalizedSearch ? group.notes.filter((note) => `${group.day} ${note.text} ${note.author}`.toLowerCase().includes(normalizedSearch)) : group.notes,
  })).filter((group) => group.notes.length > 0);

  return (
    React.createElement('div', { className: "min-h-screen bg-background" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}
      , React.createElement(NavBarClient, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 58}} )
      , React.createElement(PageIntro, { eyebrow: "Diário de cuidados"  , title: "Anotações", text: "Registros simples para manter a família e os cuidadores sempre alinhados."          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}} )
      , React.createElement('main', { className: "mx-auto max-w-5xl px-5 pb-16 lg:px-8"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}
        , React.createElement('div', { className: "grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
          , React.createElement('label', { className: "flex min-h-12 min-w-0 items-center gap-3 rounded-lg border border-border bg-card px-4"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}
            , React.createElement(Search, { className: "size-5 shrink-0 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}} )
            , React.createElement('input', {
              value: search,
              onChange: (event) => setSearch(event.target.value),
              'aria-label': "Buscar anotações" ,
              placeholder: "Buscar por palavra, data ou responsável"     ,
              className: "w-full min-w-0 bg-transparent text-sm outline-hidden placeholder:text-muted-foreground"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
            )
          )
          , React.createElement(Button, { onClick: addNote, className: "min-h-12", __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}, React.createElement(Plus, { className: "size-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}} ), " Nova anotação"  )
        )

        , React.createElement('div', { className: "mt-7 space-y-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}
          , visibleGroups.map((group) => {
            const isOpen = openDay === group.day;

            return (
              React.createElement('section', { key: group.day, className: "rounded-lg border border-border bg-card shadow-soft"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}
                , React.createElement(Button, {
                  type: "button",
                  variant: "ghost",
                  onClick: () => setOpenDay(isOpen ? "" : group.day),
                  className: "grid h-auto w-full grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-lg p-5 text-left hover:bg-accent"        ,
                  'aria-expanded': isOpen, __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}

                  , React.createElement('span', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}
                    , React.createElement('span', { className: "block font-heading text-2xl font-semibold text-primary"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}, group.day)
                    , React.createElement('span', { className: "mt-1 block text-sm text-muted-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}, group.summary)
                  )
                  , React.createElement(ChevronDown, { className: isOpen ? "size-5 rotate-180 text-emergency transition-transform" : "size-5 text-emergency transition-transform", __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}} )
                )

                , isOpen && (
                  React.createElement('div', { className: "space-y-4 border-t border-border p-5 pt-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}
                    , group.notes.map((note) => (
                      React.createElement('article', { key: `${group.day}-${note.time}-${note.text}`, className: "grid gap-2 rounded-lg bg-background p-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}
                        , React.createElement('p', { className: "text-xs font-semibold text-emergency"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}, note.time)
                        , React.createElement('p', { className: "leading-7 text-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}, note.text)
                        , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}, "Registrado por "  , note.author)
                      )
                    ))
                  )
                )
              )
            );
          })
        )
      )
    )
  );
}