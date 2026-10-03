import React from "react";
const _jsxFileName = ""; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }import { NavBarCaregiver } from "@/components/NavBarCaregiver";
import helenaPhoto from "@/assets/helena-soares.jpg";
import { PageIntro } from "../client/CuidadoresClient";
import { useState } from "react";
import { Bot, ClipboardCheck, Plus, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const clients = [
  {
    name: "Helena Soares",
    age: "84 anos",
    shift: "Hoje • 08h às 18h",
    nextCare: "Hidratação às 10:30",
    aiEnabled: true,
    notes: [
      { day: "Hoje", time: "10:20", text: "Hidratação confirmada: Helena tomou um copo de água." },
      { day: "Hoje", time: "08:45", text: "Paciente acordou bem-disposta e aceitou o café da manhã." },
      { day: "Ontem", time: "17:50", text: "Família avisada sobre melhora no apetite." },
    ],
  },
  {
    name: "Antônio Lima",
    age: "79 anos",
    shift: "Quinta • 12h às 20h",
    nextCare: "Alongamento assistido às 15:00",
    aiEnabled: false,
    notes: [
      { day: "Ontem", time: "16:10", text: "Caminhada curta realizada sem queixas." },
      { day: "20/09", time: "13:30", text: "Almoço completo e boa aceitação de líquidos." },
    ],
  },
];

const defaultClient = clients[0];

export function ClientesCaregiver() {
  const [selectedClient, setSelectedClient] = useState(defaultClient.name);
  const [aiMessage, setAiMessage] = useState("");
  const [aiSent, setAiSent] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [addedNotes, setAddedNotes] = useState({});
  const client = _nullishCoalesce(clients.find((item) => item.name === selectedClient), () => ( defaultClient));
  const notes = [
    ...(_nullishCoalesce(addedNotes[client.name], () => ( []))).map((text) => ({ day: "Hoje", time: "Agora", text })),
    ...client.notes,
  ];
  const groupedNotes = notes.reduce((groups, note) => {
    groups[note.day] = [...(_nullishCoalesce(groups[note.day], () => ( []))), note];
    return groups;
  }, {});

  return (
    React.createElement('div', { className: "min-h-screen bg-background" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}
      , React.createElement(NavBarCaregiver, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 57}} )
      , React.createElement(PageIntro, { eyebrow: "Pessoas acompanhadas" , title: "Clientes e anotações"  , text: "Consulte cada cliente, registre observações separadas e acesse a IA quando o plano permitir."             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}} )
      , React.createElement('main', { className: "mx-auto grid max-w-7xl gap-6 px-5 pb-16 lg:grid-cols-[20rem_minmax(0,1fr)] lg:px-8"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}
        , React.createElement('aside', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}
          , clients.map((item) => (
            React.createElement(Button, {
              key: item.name,
              type: "button",
              variant: item.name === selectedClient ? "default" : "secondary",
              onClick: () => {
                setSelectedClient(item.name);
                setAiMessage("");
                setAiSent(false);
              },
              className: "h-auto w-full justify-start rounded-lg p-4 text-left"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}

              , React.createElement('span', { className: "grid min-w-0 gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}
                , React.createElement('span', { className: "font-heading text-lg font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}, item.name)
                , React.createElement('span', { className: "text-xs opacity-80" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}, item.nextCare)
              )
            )
          ))
        )

        , React.createElement('section', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}
          , React.createElement('article', { className: "rounded-lg border border-border bg-card p-6 shadow-soft"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}
            , React.createElement('div', { className: "grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}
              , React.createElement('img', { src: helenaPhoto, alt: client.name, width: 816, height: 816, className: "size-24 rounded-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 84}} )
              , React.createElement('div', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
                , React.createElement('p', { className: "text-xs font-semibold text-success"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}, "ACOMPANHAMENTO ATIVO" )
                , React.createElement('h2', { className: "mt-1 font-heading text-3xl font-semibold text-primary"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}, client.name)
                , React.createElement('p', { className: "mt-2 text-sm text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}, client.age, " • "  , client.shift)
                , React.createElement('p', { className: "mt-2 text-sm font-medium text-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}, "Próximo cuidado: "  , client.nextCare)
              )
              , React.createElement(Button, { onClick: () => setNoteOpen(true), __self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}, React.createElement(Plus, { className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 91}} ), " Nova anotação"  )
            )
          )

          , React.createElement('section', { className: "rounded-lg border border-border bg-card p-6 shadow-soft"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}}
            , React.createElement('h3', { className: "font-heading text-2xl font-semibold text-primary"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}, "Anotações de "  , client.name)
            , React.createElement('div', { className: "mt-5 space-y-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 97}}
              , Object.entries(groupedNotes).map(([day, notes]) => (
                React.createElement('div', { key: day, __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
                  , React.createElement('p', { className: "text-sm font-semibold text-emergency"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}, day)
                  , React.createElement('div', { className: "mt-3 space-y-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
                    , notes.map((note) => (
                      React.createElement('article', { key: `${note.day}-${note.time}-${note.text}`, className: "grid grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-lg bg-background p-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}
                        , React.createElement('span', { className: "grid size-10 place-items-center rounded-lg bg-success-soft text-success"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 104}}, React.createElement(ClipboardCheck, { className: "size-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 104}} ))
                        , React.createElement('div', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}
                          , React.createElement('p', { className: "text-xs font-semibold text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}}, note.time)
                          , React.createElement('p', { className: "mt-1 leading-7 text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}, note.text)
                        )
                      )
                    ))
                  )
                )
              ))
            )
          )

          , React.createElement('section', { className: client.aiEnabled ? "rounded-lg bg-primary p-6 text-primary-foreground shadow-brand" : "rounded-lg border border-border bg-card p-6 shadow-soft", __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
            , React.createElement('p', { className: client.aiEnabled ? "flex items-center gap-2 text-sm font-semibold text-highlight" : "flex items-center gap-2 text-sm font-semibold text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}
              , React.createElement(Bot, { className: "size-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}} ), " IA de saúde do cliente"
            )
            , client.aiEnabled ? (
              React.createElement('div', { className: "mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}
                , React.createElement('label', { className: "block text-sm font-medium text-primary-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}, "Dúvida durante o plantão"

                   , React.createElement('textarea', {
                    value: aiMessage,
                     onChange: (event) => {
                       setAiMessage(event.target.value);
                       setAiSent(false);
                     },
                    placeholder: "Ex.: Helena recusou água nas últimas duas horas..."       ,
                    className: "mt-2 min-h-24 w-full resize-none rounded-lg border border-primary-foreground/25 bg-primary-foreground/10 p-4 text-sm outline-hidden placeholder:text-primary-foreground/60 focus:border-highlight focus:ring-3 focus:ring-highlight/35"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}
                  )
                )
                 , React.createElement(Button, { variant: "secondary", disabled: !aiMessage.trim(), onClick: () => setAiSent(true), className: "min-h-12", __self: this, __source: {fileName: _jsxFileName, lineNumber: 135}}, React.createElement(Send, { className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 135}} ), " Consultar IA"  )
                 , aiSent && (
                   React.createElement('div', { className: "rounded-lg bg-primary-foreground/10 p-4 text-sm leading-6 lg:col-span-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}
                     , React.createElement('p', { className: "font-semibold text-highlight" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}, "Orientação inicial" )
                     , React.createElement('p', { className: "mt-1 text-primary-foreground/85" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}, "Registre o horário e observe a evolução. Se houver piora ou novos sintomas, avise a família e procure orientação profissional."                   )
                   )
                 )
              )
            ) : (
              React.createElement('p', { className: "mt-3 text-sm leading-6 text-muted-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}, "Este cliente ainda não contratou o recurso de IA. O acesso aparece aqui quando o plano estiver ativo."                 )
            )
          )
        )
      )
      , noteOpen && (
        React.createElement('div', { role: "dialog", 'aria-modal': "true", 'aria-labelledby': "new-note-title", className: "fixed inset-0 z-[60] grid place-items-center bg-overlay p-5"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}
          , React.createElement('section', { className: "w-full max-w-lg rounded-lg bg-card p-6 shadow-modal"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 151}}
            , React.createElement('div', { className: "flex items-start justify-between gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 152}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}
                , React.createElement('p', { className: "text-sm font-semibold text-emergency"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}, "Registro de cuidado"  )
                , React.createElement('h2', { id: "new-note-title", className: "mt-1 font-heading text-2xl font-semibold text-primary"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}, "Nova anotação para "   , client.name)
              )
              , React.createElement(Button, { variant: "ghost", size: "icon", 'aria-label': "Fechar", onClick: () => setNoteOpen(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}, React.createElement(X, { className: "size-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 157}} ))
            )
            , React.createElement('label', { className: "mt-6 block text-sm font-medium text-foreground"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 159}}, "O que aconteceu durante o cuidado?"

              , React.createElement('textarea', { value: newNote, onChange: (event) => setNewNote(event.target.value), autoFocus: true, placeholder: "Descreva a observação com horário e detalhes importantes..."       , className: "mt-2 min-h-32 w-full resize-none rounded-lg border border-input bg-background p-4 text-sm outline-hidden focus:border-primary focus:ring-3 focus:ring-primary/15"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}} )
            )
            , React.createElement('div', { className: "mt-6 flex justify-end gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 163}}
              , React.createElement(Button, { variant: "secondary", onClick: () => setNoteOpen(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 164}}, "Cancelar")
              , React.createElement(Button, { disabled: !newNote.trim(), onClick: () => {
                const note = newNote.trim();
                if (!note) return;
                setAddedNotes((current) => ({ ...current, [client.name]: [note, ...(_nullishCoalesce(current[client.name], () => ( [])))] }));
                setNewNote("");
                setNoteOpen(false);
              }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 165}}, "Salvar anotação" )
            )
          )
        )
      )
    )
  );
}