import React from "react";
const _jsxFileName = "";import { useState } from "react";
import { ClipboardPlus, Droplets, FileHeart, FlaskConical, MessageCircleHeart, Stethoscope, X, } from "lucide-react";
import helenaPhoto from "@/assets/helena-soares.jpg";
import lucianaPhoto from "@/assets/luciana-ribeiro.jpg";
import { NavBarClient } from "@/components/NavBarClient";
import { Button } from "@/components/ui/button";

const vitals = [
  { label: "Pressão", value: "12/8", unit: "mmHg" },
  { label: "Oxigenação", value: "97%", unit: "Estável" },
  { label: "Glicemia", value: "92", unit: "mg/dL" },
  { label: "Temperatura", value: "36,4", unit: "°C" },
];

const actionDetails = {
  Anotação: {
    icon: ClipboardPlus,
    title: "Nova anotação",
    text: "Registre algo observado pela família para deixar o histórico completo.",
    fields: ["Helena reclamou de leve cansaço após o almoço.", "Avisar a cuidadora no próximo contato."],
  },
  Sintomas: {
    icon: Stethoscope,
    title: "Registrar sintomas",
    text: "Marque sintomas percebidos e deixe a equipe de cuidado ciente.",
    fields: ["Tontura leve ao levantar", "Sem febre registrada", "Dor no joelho direito"],
  },
  Relatórios: {
    icon: FileHeart,
    title: "Relatórios recentes",
    text: "Resumo dos registros mais importantes para compartilhar com a família.",
    fields: ["Relatório diário: rotina dentro do esperado", "Semana: hidratação precisa de atenção"],
  },
  Exames: {
    icon: FlaskConical,
    title: "Exames",
    text: "Acompanhe exames salvos e próximos resultados esperados.",
    fields: ["Hemograma: resultado anexado ontem", "Glicemia: próxima coleta em 28/09"],
  },
} ;



export function HomeClient() {
  const [hydrated, setHydrated] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  return (
    React.createElement('div', { className: "min-h-screen bg-background" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}
      , React.createElement(NavBarClient, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 50}} )
      , React.createElement('main', { className: "mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-12"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}
        , React.createElement('div', { className: "mb-8 border-b border-border pb-7"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}
            , React.createElement('p', { className: "mb-2 text-sm font-semibold text-emergency"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}, "Acompanhamento familiar" )
            , React.createElement('h1', { className: "font-heading text-4xl font-semibold text-primary sm:text-5xl"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 55}}, "Bom dia, João."  )
            , React.createElement('p', { className: "mt-3 max-w-2xl text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}, "Veja com clareza como está o dia de Helena e acompanhe cada cuidado importante."             )
          )
        )

        , React.createElement('div', { className: "grid grid-cols-12 gap-7 lg:gap-10"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}
          , React.createElement('aside', { className: "col-span-12 space-y-6 lg:col-span-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
            , React.createElement('section', { className: "rounded-lg border border-border bg-card p-6 shadow-soft sm:p-8"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}
              , React.createElement('div', { className: "flex flex-col items-center text-center"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}
                , React.createElement('img', { src: helenaPhoto, alt: "Helena Soares" , width: 816, height: 816, className: "size-28 rounded-full border-4 border-highlight object-cover"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}} )
                , React.createElement('h2', { className: "mt-4 font-heading text-3xl font-semibold text-primary"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}, "Helena Soares" )
                , React.createElement('p', { className: "mt-1 text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}, "84 anos • Tipo sanguíneo O+"     )
              )
              , React.createElement('div', { className: "mt-7 grid grid-cols-2 gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}
                , vitals.map((vital) => (
                  React.createElement('div', { key: vital.label, className: "rounded-lg border border-border bg-background p-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}
                    , React.createElement('p', { className: "text-xs font-semibold text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}, vital.label)
                    , React.createElement('p', { className: "mt-1 font-heading text-2xl font-semibold text-primary"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}, vital.value)
                    , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}, vital.unit)
                  )
                ))
              )
            )

            , React.createElement('section', { className: "rounded-lg bg-primary p-6 text-primary-foreground shadow-brand"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}
              , React.createElement('p', { className: "text-xs font-medium text-highlight"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}, "Cuidadora de plantão"  )
              , React.createElement('div', { className: "mt-3 flex items-center gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}
                , React.createElement('img', { src: lucianaPhoto, alt: "Luciana Ribeiro" , loading: "lazy", width: 816, height: 816, className: "size-14 rounded-full border-2 border-primary-foreground/30 object-cover"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}} )
                , React.createElement('div', { className: "min-w-0 flex-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}
                  , React.createElement('p', { className: "font-semibold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}, "Luciana Ribeiro" )
                  , React.createElement('p', { className: "text-xs text-primary-foreground/70" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}, "No local desde 08:00"   )
                )
                , React.createElement(Button, { variant: "ghost", 'aria-label': "Conversar com Luciana"  , title: "Conversar com Luciana"  , className: "size-11 px-0 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}, React.createElement(MessageCircleHeart, { className: "size-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}} ))
              )
            )

            , React.createElement('section', { 'aria-label': "Ações rápidas" , className: "grid grid-cols-2 gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}
              , (Object.keys(actionDetails) ).map((label) => (
                React.createElement(QuickAction, { key: label, icon: actionDetails[label].icon, label: label, onClick: () => setActiveAction(label), __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}} )
              ))
            )
          )

          , React.createElement('section', { className: "col-span-12 lg:col-span-8" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
                , React.createElement('p', { className: "text-sm font-semibold text-emergency"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}, "Terça-feira, 22 de setembro"   )
                , React.createElement('h2', { className: "mt-1 font-heading text-4xl font-semibold text-primary"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}, "Relatório do dia"  )
                , React.createElement('p', { className: "mt-2 max-w-xl text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}, "Tudo segue dentro da normalidade esperada para o quadro."        )
              )
            )

            , React.createElement('div', { className: "mt-8 space-y-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}
              , React.createElement(TimelineItem, { time: "08:00 • Medicamento"  , title: "Losartana 50 mg"  , status: "Administrado", tone: "done", __self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}, "Helena acordou disposta e tomou a medicação com água, sem dificuldades."

              )
              , React.createElement('div', { className: "flex gap-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}
                , React.createElement('div', { className: "flex w-5 shrink-0 flex-col items-center pt-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}, React.createElement('span', { className: "size-4 rounded-full border-2 border-emergency bg-highlight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}} ), React.createElement('span', { className: "mt-2 h-full min-h-24 w-px bg-highlight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}} ))
                , React.createElement('div', { className: "flex-1 rounded-lg border-2 border-highlight bg-highlight/20 p-6"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}
                  , React.createElement('p', { className: "flex items-center gap-2 text-xs font-bold text-emergency"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 114}}, React.createElement(Droplets, { className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 114}} ), " INTELIGÊNCIA PREVENTIVA"  )
                  , React.createElement('p', { className: "mt-3 max-w-xl text-sm font-medium leading-6 text-primary"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}, "Notamos uma redução na ingestão de água nas últimas três horas. Sugerimos oferecer água ou suco natural agora."                 )
                  , React.createElement(Button, { variant: "ghost", disabled: hydrated, onClick: () => setHydrated(true), className: "mt-3 px-0 text-emergency hover:bg-transparent hover:text-emergency"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}
                    , hydrated ? "Hidratação confirmada" : "Confirmar hidratação agora"
                  )
                )
              )
              , React.createElement(TimelineItem, { time: "13:30 • Atividade"  , title: "Caminhada assistida" , status: "Pendente", tone: "pending", __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}, "Caminhada leve de 20 minutos acompanhada pela cuidadora."       )
            )
          )
        )
      )

      , activeAction && React.createElement(ActionModal, { action: activeAction, onClose: () => setActiveAction(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 127}} )
    )
  );
}

function TimelineItem({ time, title, status, tone, children }) {
  return (
    React.createElement('div', { className: "flex gap-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 134}}
      , React.createElement('div', { className: "flex w-5 shrink-0 flex-col items-center pt-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 135}}, React.createElement('span', { className: tone === "done" ? "size-4 rounded-full bg-primary ring-4 ring-success-soft" : "size-4 rounded-full bg-muted", __self: this, __source: {fileName: _jsxFileName, lineNumber: 135}} ), React.createElement('span', { className: "mt-2 h-full min-h-24 w-px bg-highlight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 135}} ))
      , React.createElement('article', { className: "flex-1 rounded-lg border border-border bg-card p-6 shadow-soft"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}
        , React.createElement('div', { className: "flex flex-wrap items-start justify-between gap-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}, React.createElement('p', { className: "text-xs font-bold text-primary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}, time), React.createElement('h3', { className: "mt-1 font-heading text-xl font-semibold text-primary"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}, title))
          , React.createElement('span', { className: tone === "done" ? "rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success" : "rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}, status)
        )
        , React.createElement('p', { className: "mt-3 max-w-xl text-sm leading-6 text-muted-foreground"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}, children)
      )
    )
  );
}

function QuickAction({ icon: Icon, label, onClick }) {
  return (
    React.createElement(Button, { variant: "secondary", className: "h-28 flex-col items-start p-5 text-left"    , onClick: onClick, __self: this, __source: {fileName: _jsxFileName, lineNumber: 149}}
      , React.createElement('span', { className: "grid size-10 place-items-center rounded-lg bg-highlight/35 text-emergency"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}, React.createElement(Icon, { className: "size-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}} ))
      , React.createElement('span', { className: "text-primary", __self: this, __source: {fileName: _jsxFileName, lineNumber: 151}}, label)
    )
  );
}

function ActionModal({ action, onClose }) {
  const details = actionDetails[action];
  const Icon = details.icon;

  return (
    React.createElement('div', { role: "dialog", 'aria-modal': "true", 'aria-labelledby': "quick-action-title", className: "fixed inset-0 z-[60] grid place-items-center bg-overlay p-5"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}
      , React.createElement('section', { className: "w-full max-w-lg rounded-lg bg-card p-6 shadow-modal sm:p-7"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 162}}
        , React.createElement('div', { className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 163}}
          , React.createElement('div', { className: "flex min-w-0 gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 164}}
            , React.createElement('span', { className: "grid size-12 shrink-0 place-items-center rounded-lg bg-highlight/35 text-emergency"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 165}}, React.createElement(Icon, { className: "size-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 165}} ))
            , React.createElement('div', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 166}}
              , React.createElement('h2', { id: "quick-action-title", className: "font-heading text-2xl font-semibold text-primary"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 167}}, details.title)
              , React.createElement('p', { className: "mt-2 text-sm leading-6 text-muted-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 168}}, details.text)
            )
          )
          , React.createElement(Button, { variant: "ghost", size: "icon", 'aria-label': "Fechar", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 171}}, React.createElement(X, { className: "size-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 171}} ))
        )

        , React.createElement('div', { className: "mt-6 space-y-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}
          , details.fields.map((field) => (
            React.createElement('p', { key: field, className: "rounded-lg border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 176}}
              , field
            )
          ))
        )

        , action === "Anotação" || action === "Sintomas" ? (
          React.createElement('label', { className: "mt-5 block text-sm font-medium text-foreground"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 183}}, "Complementar registro"

            , React.createElement('textarea', { className: "mt-2 min-h-24 w-full resize-none rounded-lg border border-input bg-background p-4 text-sm outline-hidden focus:border-primary focus:ring-3 focus:ring-primary/15"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}} )
          )
        ) : null

        , React.createElement('div', { className: "mt-6 flex justify-end gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 189}}
          , React.createElement(Button, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 190}}, "Fechar")
          , React.createElement(Button, { onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 191}}, "Salvar")
        )
      )
    )
  );
}