import { useState } from "react";
import { ChevronDown, Edit3, Plus, Search } from "lucide-react";
import { NavBarClient } from "@/components/NavBarClient";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { PageIntro } from "./CuidadoresClient";

const initialGroups = [
  {
    day: "22 de setembro",
    notes: [
      { id: "1020", time: "10:20", text: "Helena dormiu bem e acordou disposta.", author: "Luciana Ribeiro" },
      { id: "0845", time: "08:45", text: "Leve desconforto no joelho após a caminhada.", author: "Luciana Ribeiro" },
    ],
  },
  {
    day: "21 de setembro",
    notes: [
      { id: "810", time: "18:10", text: "Jantou sopa e aceitou a medicação da noite.", author: "Marcos Soares" },
      { id: "430", time: "14:30", text: "Fez repouso após a fisioterapia.", author: "Luciana Ribeiro" },
      { id: "0905", time: "09:05", text: "Pressão aferida dentro da normalidade.", author: "Luciana Ribeiro" },
    ],
  },
  {
    day: "20 de setembro",
    notes: [
      { id: "1215", time: "12:15", text: "Almoço completo e boa hidratação durante a manhã.", author: "Marcos Soares" },
    ],
  },
];

const defaultDay = initialGroups[0]?.day ?? "";

function summaryFor(notes) {
  return `${notes.length} ${notes.length === 1 ? "anotação" : "anotações"}`;
}

export function AnotacoesClient() {
  const [groups, setGroups] = useState(initialGroups);
  const [openDay, setOpenDay] = useState(defaultDay);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [draft, setDraft] = useState("");

  const openNewNote = () => {
    setDraft("");
    setModal({ groupDay: defaultDay, noteId: null });
  };

  const openEditNote = (groupDay, note) => {
    setDraft(note.text);
    setModal({ groupDay, noteId: note.id });
  };

  const closeModal = () => setModal(null);

  const saveNote = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setGroups((current) => current.map((group) => {
      if (group.day !== modal.groupDay) return group;

      if (modal.noteId) {
        return {
          ...group,
          notes: group.notes.map((note) => note.id === modal.noteId ? { ...note, text } : note),
        };
      }

      return {
        ...group,
        notes: [
          { id: `note-${Date.now()}`, time: "Agora", text, author: "João Soares" },
          ...group.notes,
        ],
      };
    }));
    setOpenDay(defaultDay);
    closeModal();
  };

  const normalizedSearch = search.trim().toLowerCase();
  const visibleGroups = groups.map((group) => ({
    ...group,
    summary: summaryFor(group.notes),
    notes: normalizedSearch
      ? group.notes.filter((note) => `${group.day} ${note.text} ${note.author}`.toLowerCase().includes(normalizedSearch))
      : group.notes,
  })).filter((group) => group.notes.length > 0);

  const editing = modal?.noteId != null;

  return (
    <div className="min-h-screen bg-background">
      <NavBarClient />
      <PageIntro eyebrow="Diário de cuidados" title="Anotações" text="Registros simples para manter a família e os cuidadores sempre alinhados." />
      <main className="mx-auto max-w-5xl px-5 pb-16 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="flex min-h-12 min-w-0 items-center gap-3 rounded-lg border border-border bg-card px-4">
            <Search className="size-5 shrink-0 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar anotações"
              placeholder="Buscar por palavra, data ou responsável"
              className="w-full min-w-0 bg-transparent text-sm outline-hidden placeholder:text-muted-foreground"
            />
          </label>
          <Button onClick={openNewNote} className="min-h-12">
            <Plus className="size-5" /> Nova anotação
          </Button>
        </div>

        <div className="mt-7 space-y-4">
          {visibleGroups.map((group) => {
            const isOpen = openDay === group.day;

            return (
              <section key={group.day} className="rounded-lg border border-border bg-card shadow-soft">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenDay(isOpen ? "" : group.day)}
                  className="grid h-auto w-full grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-lg p-5 text-left hover:bg-accent"
                  aria-expanded={isOpen}
                >
                  <span className="min-w-0">
                    <span className="block font-heading text-2xl font-semibold text-primary">{group.day}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{group.summary}</span>
                  </span>
                  <ChevronDown className={isOpen ? "size-5 rotate-180 text-emergency transition-transform" : "size-5 text-emergency transition-transform"} />
                </Button>

                {isOpen && (
                  <div className="space-y-4 border-t border-border p-5 pt-4">
                    {group.notes.map((note) => (
                      <article key={note.id} className="grid gap-2 rounded-lg bg-background p-4">
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-xs font-semibold text-emergency">{note.time}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditNote(group.day, note)}
                            aria-label={`Editar anotação das ${note.time}`}
                            className="min-h-9 gap-2 px-2 text-primary"
                          >
                            <Edit3 className="size-4" /> Editar
                          </Button>
                        </div>
                        <p className="leading-7 text-foreground">{note.text}</p>
                        <p className="text-sm text-muted-foreground">Registrado por {note.author}</p>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>

      {modal && (
        <Modal titulo={editing ? "Editar anotação" : "Nova anotação"} aoFechar={closeModal}>
          <form onSubmit={saveNote} className="space-y-5">
            <label htmlFor="anotacao-texto" className="block text-sm font-medium text-foreground">
              Texto da anotação
              <textarea
                id="anotacao-texto"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Descreva como foi o atendimento ou o estado do paciente."
                maxLength={500}
                required
                autoFocus
                className="mt-2 min-h-32 w-full resize-y rounded-lg border border-input bg-background p-4 text-sm outline-hidden focus:border-primary focus:ring-3 focus:ring-primary/15"
              />
              <span className="mt-1 block text-right text-xs text-muted-foreground">{draft.length}/500</span>
            </label>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={closeModal}>Cancelar</Button>
              <Button type="submit">{editing ? "Salvar alterações" : "Enviar anotação"}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
