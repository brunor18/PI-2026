import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Modal({ titulo, aoFechar, bloqueado = false, children }) {
  const dialogRef = useRef(null);
  const tituloId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();

    return () => {
      dialog.close();
      document.body.style.overflow = overflowAnterior;
    };
  }, []);

  function fecharPeloFundo(event) {
    if (bloqueado || event.target !== event.currentTarget) return;
    const { left, right, top, bottom } = event.currentTarget.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) {
      aoFechar();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={tituloId}
      onClick={fecharPeloFundo}
      onCancel={(event) => { if (bloqueado) event.preventDefault(); }}
      onClose={(event) => { if (!event.currentTarget.open && !bloqueado) aoFechar(); }}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-lg border border-border bg-card p-5 text-foreground shadow-modal backdrop:bg-overlay sm:p-8"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <h2 id={tituloId} className="font-heading text-2xl font-semibold text-primary">
          {titulo}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={bloqueado}
          onClick={aoFechar}
          aria-label="Fechar"
          className="size-11 shrink-0"
        >
          <X aria-hidden="true" />
        </Button>
      </div>
      {children}
    </dialog>
  );
}
