import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import api from "../services/api.service";

const dadosIniciais = {
  nome: "",
  email: "",
  numeroTelefone: "",
  senha: "",
  confirmarSenha: "",
  PIN: "",
  tipoUsuario: 1,
};

const campos = [
  { nome: "nome", rotulo: "Nome", tipo: "text", autoComplete: "name" },
  { nome: "email", rotulo: "E-mail", tipo: "email", autoComplete: "email" },
  { nome: "numeroTelefone", rotulo: "Telefone", tipo: "tel", autoComplete: "tel" },
  { nome: "senha", rotulo: "Senha", tipo: "password", autoComplete: "new-password", minLength: 6, ajuda: "Use pelo menos 6 caracteres." },
  { nome: "confirmarSenha", rotulo: "Confirme a senha", tipo: "password", autoComplete: "new-password", minLength: 6 },
  { nome: "PIN", rotulo: "PIN", tipo: "password", minLength: 4, maxLength: 6, inputMode: "numeric", pattern: "[0-9]{4,6}", ajuda: "Escolha de 4 a 6 números para entrar na sua conta." },
];

export function Cadastro() {
  const [dados, setDados] = useState(dadosIniciais);
  const [visibilidade, setVisibilidade] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  function atualizarCampo(nome, valor) {
    const novoValor = nome === "PIN" ? valor.replace(/[^0-9]/g, "").slice(0, 6) : valor;
    setDados((atuais) => ({ ...atuais, [nome]: novoValor }));
  }

  async function fazerCadastro(event) {
    event.preventDefault();
    if (carregando) return;
    setErro("");

    if (!dados.nome.trim() || !dados.numeroTelefone.trim()) {
      setErro("Preencha o nome e o telefone.");
      return;
    }
    if (dados.senha.length < 6 || !/^[0-9]{4,6}$/.test(dados.PIN)) {
      setErro("Use uma senha de pelo menos 6 caracteres e um PIN de 4 a 6 números.");
      return;
    }
    if (dados.senha !== dados.confirmarSenha) {
      setErro("As senhas não coincidem. Confira a confirmação de senha.");
      return;
    }

    setCarregando(true);
    try {
      const response = await api.post("/api/auth/cadastro", {
        nome: dados.nome.trim(),
        email: dados.email.trim().toLowerCase(),
        numeroTelefone: dados.numeroTelefone.trim(),
        senha: dados.senha,
        PIN: dados.PIN,
        tipoUsuario: dados.tipoUsuario,
      });

      if (response.status !== 201) {
        throw new Error("O servidor não confirmou a criação da conta.");
      }
      setDados(dadosIniciais);
      setVisibilidade({});
      setSucesso(true);
    } catch (error) {
      const validacoes = error.response?.data?.errors;
      const mensagemValidacao = validacoes ? Object.values(validacoes).flat().join(" ") : "";
      setErro(
        error.response?.data?.mensagem || mensagemValidacao ||
          (error.response
            ? "Não foi possível cadastrar. Confira os dados e tente novamente."
            : error.request
              ? "Não foi possível conectar ao servidor. Tente novamente."
              : error.message || "Não foi possível cadastrar. Tente novamente."),
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background p-4">
      <section className="w-full max-w-sm rounded-lg border border-border bg-card p-4 shadow-modal sm:p-5">
        <BrandLogo />
        <h1 className="mt-4 font-heading text-3xl font-semibold leading-tight text-primary">
          {sucesso ? "Conta criada" : "Crie sua conta"}
        </h1>
        {sucesso ? (
          <div className="mt-4 space-y-3">
            <p role="status" className="text-lg leading-relaxed text-foreground">
              Cadastro realizado com sucesso. Entre com seu e-mail e PIN. No primeiro acesso, será necessário confirmar sua senha.
            </p>
            <Button asChild className="min-h-12 w-full text-lg font-semibold">
              <Link to="/login">Ir para o login</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
              Preencha seus dados para começar.
            </p>
            <form onSubmit={fazerCadastro} className="mt-4 space-y-3" aria-busy={carregando}>
              <fieldset>
                <legend className="text-lg font-medium text-foreground">
                  Tipo de conta
                </legend>
                <div className="mt-2 grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
                  <Button
                    type="button"
                    variant={dados.tipoUsuario === 2 ? "default" : "outline"}
                    disabled={carregando}
                    aria-pressed={dados.tipoUsuario === 2}
                    onClick={() => atualizarCampo("tipoUsuario", 2)}
                    className="min-h-12 w-full px-2 text-base font-semibold"
                  >
                    Conta cuidador
                  </Button>
                  <Button
                    type="button"
                    variant={dados.tipoUsuario === 1 ? "default" : "outline"}
                    disabled={carregando}
                    aria-pressed={dados.tipoUsuario === 1}
                    onClick={() => atualizarCampo("tipoUsuario", 1)}
                    className="min-h-12 w-full px-2 text-base font-semibold"
                  >
                    Conta Idoso
                  </Button>
                </div>
              </fieldset>
              {campos.map((campo) => {
                const protegido = campo.tipo === "password";
                const visivel = Boolean(visibilidade[campo.nome]);
                const id = `cadastro-${campo.nome}`;

                return (
                  <div key={campo.nome}>
                    <label htmlFor={id} className="block text-lg font-medium text-foreground">
                      {campo.rotulo}
                    </label>
                    <div className="relative mt-2">
                      <input
                        id={id}
                        name={campo.nome}
                        type={protegido && visivel ? "text" : campo.tipo}
                        autoComplete={campo.autoComplete}
                        inputMode={campo.inputMode}
                        pattern={campo.pattern}
                        minLength={campo.minLength}
                        maxLength={campo.maxLength}
                        required
                        disabled={carregando}
                        value={dados[campo.nome]}
                        onChange={(event) => atualizarCampo(campo.nome, event.target.value)}
                        aria-describedby={campo.ajuda ? `${id}-ajuda` : undefined}
                        className={`min-h-12 w-full rounded-lg border border-input bg-background px-4 text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 ${protegido ? "pr-14" : ""}`}
                      />
                      {protegido && (
                        <button
                          type="button"
                          disabled={carregando}
                          onClick={() => setVisibilidade((atuais) => ({ ...atuais, [campo.nome]: !atuais[campo.nome] }))}
                          aria-label={`${visivel ? "Ocultar" : "Mostrar"} ${campo.rotulo.toLowerCase()}`}
                          aria-pressed={visivel}
                          aria-controls={id}
                          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                        >
                          {visivel ? <Eye size={24} aria-hidden="true" /> : <EyeOff size={24} aria-hidden="true" />}
                        </button>
                      )}
                    </div>
                    {campo.ajuda && (
                      <p id={`${id}-ajuda`} className="mt-1 text-base leading-snug text-muted-foreground">
                        {campo.ajuda}
                      </p>
                    )}
                  </div>
                );
              })}
              {erro && <p role="alert" className="text-lg leading-relaxed text-destructive">{erro}</p>}
              <Button type="submit" disabled={carregando} className="min-h-12 w-full text-lg font-semibold">
                {carregando ? "Cadastrando..." : "Criar conta"}
              </Button>
            </form>
            <p className="mt-4 text-center text-lg text-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="font-semibold text-primary underline underline-offset-4">Entrar</Link>
            </p>
          </>
        )}
      </section>
    </main>
  );
}
