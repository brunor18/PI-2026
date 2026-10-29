export function resumirDescricao(descricao, limite = 160) {
  const caracteres = Array.from(descricao || "Este cuidador ainda não adicionou uma descrição.");
  return caracteres.length > limite ? `${caracteres.slice(0, limite).join("").trimEnd()}…` : caracteres.join("");
}

export function obterLinkWhatsApp(telefone) {
  const numero = String(telefone ?? "").replace(/\D/g, "");
  if (/^\d{10,11}$/.test(numero)) return `https://wa.me/55${numero}`;
  if (/^55\d{10,11}$/.test(numero)) return `https://wa.me/${numero}`;
  return null;
}
