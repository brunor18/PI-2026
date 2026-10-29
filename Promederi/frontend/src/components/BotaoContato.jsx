import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { obterLinkWhatsApp } from "@/lib/cuidadores";

export function BotaoContato({ telefone }) {
  const href = obterLinkWhatsApp(telefone);
  return href ? (
    <Button asChild className="min-h-12 w-full"><a href={href} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />Entrar em contato<span className="sr-only"> pelo WhatsApp (abre em nova aba)</span></a></Button>
  ) : <Button disabled className="min-h-12 w-full" title="Telefone não informado ou inválido"><MessageCircle aria-hidden="true" />Entrar em contato</Button>;
}
