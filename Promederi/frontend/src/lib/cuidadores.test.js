import test from "node:test";
import assert from "node:assert/strict";
import { obterLinkWhatsApp, resumirDescricao } from "./cuidadores.js";

test("WhatsApp aceita telefone com máscara e evita duplicar o código do Brasil", () => {
  assert.equal(obterLinkWhatsApp("(11) 99999-8888"), "https://wa.me/5511999998888");
  assert.equal(obterLinkWhatsApp("+55 (11) 99999-8888"), "https://wa.me/5511999998888");
  assert.equal(obterLinkWhatsApp("(55) 99999-8888"), "https://wa.me/5555999998888");
  assert.equal(obterLinkWhatsApp("(11) 3333-4444"), "https://wa.me/551133334444");
});

test("WhatsApp não cria links para telefones ausentes ou incompletos", () => {
  for (const numero of [null, undefined, "", "1234", "telefone inválido"]) {
    assert.equal(obterLinkWhatsApp(numero), null);
  }
});

test("Resumo mantém a descrição original e limita o texto sem cortar emojis", () => {
  const descricao = "😀".repeat(170);
  assert.equal(resumirDescricao(descricao), "😀".repeat(160) + "…");
  assert.equal(Array.from(descricao).length, 170);
  assert.equal(resumirDescricao("Descrição curta."), "Descrição curta.");
  assert.equal(resumirDescricao("a".repeat(160)), "a".repeat(160));
});
