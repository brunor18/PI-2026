import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import api from "../services/api.service";
import { obterDestinoDaSessao } from "@/lib/session";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [mostrarPin, setMostrarPin] = useState(false);
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [tokenTemporario, setTokenTemporario] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const requerSenha = Boolean(tokenTemporario);

  function obterTipoUsuarioDoToken(token) {
    try {
      const payload = token.split(".")[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const dadosToken = JSON.parse(atob(base64));

      if (dadosToken.tipo_usuario === "Cuidador") return 2;
      if (dadosToken.tipo_usuario === "Idoso") return 1;
      return dadosToken.tipo_usuario;
    } catch {
      return null;
    }
  }

  function concluirLogin(dados) {
    if (!dados.token || !dados.usuario?.id) {
      throw new Error("A API não retornou os dados necessários para entrar.");
    }

    const tipoUsuario = dados.usuario.tipoUsuario ?? obterTipoUsuarioDoToken(dados.token);
    let destino;

    switch (Number(tipoUsuario)) {
      case 2:
        destino = "/HomeCaregiver";
        break;
      case 1:
        destino = dados.usuario.perfilCompleto === false ? "/PerfilClient" : "/HomeClient";
        break;
      default:
        throw new Error("Tipo de usuário inválido. Não foi possível entrar.");
    }

    sessionStorage.setItem("accessToken", dados.token);
    sessionStorage.setItem("usuario", JSON.stringify({ ...dados.usuario, tipoUsuario: Number(tipoUsuario) }));
    api.defaults.headers.common.Authorization = `Bearer ${dados.token}`;
    setTokenTemporario("");
    setPin("");
    setMostrarPin(false);
    setSenha("");
    setMostrarSenha(false);
    navigate(destino, { replace: true });
  }

  async function fazerLogin() {
    const { data } = await api.post("/api/auth/login", {
      email: email.trim(),
      PIN: pin,
    });

    if (data.requerSenha) {
      if (!data.tokenTemporario) {
        throw new Error("Não foi possível iniciar a confirmação de senha.");
      }
      setTokenTemporario(data.tokenTemporario);
      setPin("");
      setMostrarPin(false);
      return;
    }

    concluirLogin(data);
  }

  async function confirmarSenha() {
    const { data } = await api.post(
      "/api/auth/confirmar-senha",
      { senha },
      { headers: { Authorization: `Bearer ${tokenTemporario}` } },
    );
    concluirLogin(data);
  }

  async function submit(event) {
    event.preventDefault();
    if (carregando) return;
    setErro("");
    setCarregando(true);

    try {
      if (requerSenha) {
        await confirmarSenha();
      } else {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("usuario");
        delete api.defaults.headers.common.Authorization;
        await fazerLogin();
      }
    } catch (error) {
      setErro(
        error.response?.data?.mensagem ||
          (error.response
            ? "Não foi possível entrar. Confira os dados ou volte ao login para tentar novamente."
            : error.request
              ? "Não foi possível conectar ao servidor. Tente novamente."
              : error.message || "Não foi possível entrar. Tente novamente."),
      );
    } finally {
      setCarregando(false);
    }
  }

  function voltarAoLogin() {
    setTokenTemporario("");
    setSenha("");
    setMostrarSenha(false);
    setPin("");
    setMostrarPin(false);
    setErro("");
  }

  const inputClassName =
    "mt-2 min-h-12 w-full rounded-lg border border-input bg-background px-4 text-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

  const destinoDaSessao = obterDestinoDaSessao();
  if (destinoDaSessao) {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    return <Navigate to={destinoDaSessao === "/HomeClient" && usuario.perfilCompleto === false ? "/PerfilClient" : destinoDaSessao} replace />;
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background p-4">
      <section className="w-full max-w-md rounded-lg border border-border bg-card p-5 shadow-modal sm:p-6">
        <Button asChild variant="ghost" className="mb-4 px-0 text-base">
          <Link to="/"><ArrowLeft aria-hidden="true" /> Voltar ao menu principal</Link>
        </Button>
        <BrandLogo />
        <h1 className="mt-5 font-heading text-3xl font-semibold leading-tight text-primary sm:text-4xl">
          {requerSenha ? "Confirme sua senha" : "Acesse sua conta"}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground" aria-live="polite">
          {requerSenha
            ? "No primeiro acesso ou após 15 dias, precisamos confirmar sua senha para continuar."
            : "Entre com seu e-mail e PIN."}
        </p>

        <form onSubmit={submit} className="mt-5 space-y-4" aria-busy={carregando}>
          {requerSenha ? (
            <div>
              <label htmlFor="login-senha" className="block text-xl font-medium text-foreground">
                Senha
              </label>
              <div className="relative mt-2">
                <input
                  id="login-senha"
                  key="senha"
                  name="senha"
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="current-password"
                  autoFocus
                  required
                  disabled={carregando}
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  className={`${inputClassName} mt-0 pr-14`}
                />
                <button
                  type="button"
                  disabled={carregando}
                  onClick={() => setMostrarSenha((visivel) => !visivel)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={mostrarSenha}
                  aria-controls="login-senha"
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                >
                  {mostrarSenha ? <Eye size={24} aria-hidden="true" /> : <EyeOff size={24} aria-hidden="true" />}
                </button>
              </div>
            </div>
          ) : (
            <>
              <label className="block text-xl font-medium text-foreground py-6">
                E-mail
                <input
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  disabled={carregando}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClassName}
                />
              </label>
              <div>
                <label htmlFor="login-pin" className="block text-xl font-medium text-foreground">
                  PIN
                </label>
                <div className="relative mt-2">
                  <input
                    id="login-pin"
                    maxLength={6}
                    name="PIN"
                    type={mostrarPin ? "text" : "password"}
                    inputMode="numeric"
                      pattern="[0-9]*"
                    required
                    disabled={carregando}
                    value={pin}
                    onChange={(event) => setPin(event.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                    className={`${inputClassName} mt-0 pr-14`}
                  />
                  <button
                    type="button"
                    disabled={carregando}
                    onClick={() => setMostrarPin((visivel) => !visivel)}
                    aria-label={mostrarPin ? "Ocultar PIN" : "Mostrar PIN"}
                    aria-pressed={mostrarPin}
                    aria-controls="login-pin"
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                  >
                    {mostrarPin ? <Eye size={24} aria-hidden="true" /> : <EyeOff size={24} aria-hidden="true" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {erro && (
            <p role="alert" className="text-xl leading-relaxed text-destructive">
              {erro}
            </p>
          )}

          <Button
            type="submit"
            disabled={carregando}
            className="min-h-12 w-full text-xl font-semibold"
          >
            {carregando ? "Aguarde..." : requerSenha ? "Confirmar senha" : "Entrar"}
          </Button>

          {requerSenha && (
            <Button
              type="button"
              variant="outline"
              disabled={carregando}
              onClick={voltarAoLogin}
              className="min-h-12 w-full text-xl"
            >
              Voltar ao login
            </Button>
          )}
        </form>
        {!requerSenha && (
          <p className="mt-5 text-center text-lg text-foreground">
            Ainda não tem uma conta?{" "}
            <Link to="/cadastro" className="font-semibold text-primary underline underline-offset-4">
              Criar conta
            </Link>
          </p>
        )}
      </section>
    </main>
  );
}
