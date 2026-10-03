import React from "react";
const _jsxFileName = "";import { useState } from "react";
import { BadgeCheck, BriefcaseMedical, Edit3, Mail, MapPin, Phone, Save } from "lucide-react";
import lucianaPhoto from "@/assets/luciana-ribeiro.jpg";
import { NavBarCaregiver } from "@/components/NavBarCaregiver";
import { Button } from "@/components/ui/button";
import { PageIntro } from "../client/CuidadoresClient";

const initialProfile = {
  name: "Luciana Ribeiro",
  role: "Cuidadora sênior",
  experience: "8 anos de experiência",
  email: "luciana@promederi.com",
  phone: "Contato protegido",
  area: "Zona Sul e região central",
  bio: "Atuação com idosos, rotina medicamentosa, mobilidade assistida e comunicação acolhedora com familiares.",
  specialties: "Alzheimer, pós-operatório, banho assistido e acompanhamento noturno",
};

export function PerfilCaregiver() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);

  const updateProfile = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  return (
    React.createElement('div', { className: "min-h-screen bg-background" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}
      , React.createElement(NavBarCaregiver, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 29}} )
      , React.createElement(PageIntro, { eyebrow: "Dados profissionais" , title: "Meu perfil" , text: "Informações visíveis para famílias que confiam o cuidado a você."         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}} )
      , React.createElement('main', { className: "mx-auto max-w-5xl px-5 pb-16"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 31}}
        , React.createElement('section', { className: "rounded-lg border border-border bg-card p-7 shadow-soft"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}}
          , React.createElement('div', { className: "grid gap-6 border-b border-border pb-7 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}}
            , React.createElement('img', { src: lucianaPhoto, alt: "Luciana Ribeiro" , width: 816, height: 816, className: "size-32 rounded-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}} )
            , React.createElement('div', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}}
              , React.createElement('p', { className: "flex items-center gap-2 text-sm font-semibold text-success"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 36}}, React.createElement(BadgeCheck, { className: "size-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 36}} ), " Perfil verificado"  )
              , React.createElement('h2', { className: "mt-2 font-heading text-3xl font-semibold text-primary"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 37}}, profile.name)
              , React.createElement('p', { className: "mt-2 text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 38}}, profile.role, " • "  , profile.experience)
              , React.createElement('p', { className: "mt-4 max-w-2xl leading-7 text-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}}, profile.bio)
            )
            , React.createElement(Button, { onClick: () => setEditing((value) => !value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 41}}
              , editing ? React.createElement(Save, { className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}} ) : React.createElement(Edit3, { className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}} )
              , editing ? "Salvar perfil" : "Editar perfil"
            )
          )

          , editing ? (
            React.createElement('div', { className: "mt-7 grid gap-4 sm:grid-cols-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}}
              , React.createElement(ProfileField, { label: "Nome", value: profile.name, onChange: (value) => updateProfile("name", value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}} )
              , React.createElement(ProfileField, { label: "Função", value: profile.role, onChange: (value) => updateProfile("role", value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}} )
              , React.createElement(ProfileField, { label: "Experiência", value: profile.experience, onChange: (value) => updateProfile("experience", value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}} )
              , React.createElement(ProfileField, { label: "Área de atendimento"  , value: profile.area, onChange: (value) => updateProfile("area", value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}} )
              , React.createElement(ProfileField, { label: "E-mail", value: profile.email, onChange: (value) => updateProfile("email", value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}} )
              , React.createElement(ProfileField, { label: "Telefone", value: profile.phone, onChange: (value) => updateProfile("phone", value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}} )
              , React.createElement('label', { className: "block text-sm font-medium text-foreground sm:col-span-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 55}}, "Apresentação"

                , React.createElement('textarea', { value: profile.bio, onChange: (event) => updateProfile("bio", event.target.value), className: "mt-2 min-h-28 w-full resize-none rounded-lg border border-input bg-background p-4 text-sm outline-hidden focus:border-primary focus:ring-3 focus:ring-primary/15"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}} )
              )
              , React.createElement(ProfileField, { label: "Especialidades", value: profile.specialties, onChange: (value) => updateProfile("specialties", value), className: "sm:col-span-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}} )
            )
          ) : (
            React.createElement('div', { className: "mt-7 grid gap-4 sm:grid-cols-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}
              , React.createElement(ProfileInfo, { icon: Mail, label: "E-mail", value: profile.email, __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}} )
              , React.createElement(ProfileInfo, { icon: Phone, label: "Telefone", value: profile.phone, __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}} )
              , React.createElement(ProfileInfo, { icon: MapPin, label: "Área de atendimento"  , value: profile.area, __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}} )
              , React.createElement(ProfileInfo, { icon: BriefcaseMedical, label: "Especialidades", value: profile.specialties, __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}} )
            )
          )
        )
      )
    )
  );
}

function ProfileField({ label, value, onChange, className = "" }) {
  return (
    React.createElement('label', { className: `block text-sm font-medium text-foreground ${className}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}
      , label
      , React.createElement('input', { value: value, onChange: (event) => onChange(event.target.value), className: "mt-2 min-h-12 w-full rounded-lg border border-input bg-background px-4 text-sm outline-hidden focus:border-primary focus:ring-3 focus:ring-primary/15"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}} )
    )
  );
}

function ProfileInfo({ icon: Icon, label, value }) {
  return (
    React.createElement('div', { className: "rounded-lg bg-background p-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}
      , React.createElement('p', { className: "flex items-center gap-2 text-xs font-semibold text-emergency"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}, React.createElement(Icon, { className: "size-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}} ), " " , label)
      , React.createElement('p', { className: "mt-2 text-sm leading-6 text-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}, value)
    )
  );
}