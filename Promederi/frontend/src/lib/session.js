// This check controls navigation only; the API still validates the token.
export function obterDestinoDaSessao() {
  try {
    const token = sessionStorage.getItem("accessToken");
    const usuario = JSON.parse(sessionStorage.getItem("usuario") || "null");
    if (!token || !usuario?.id) return null;

    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const dadosToken = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")));
    if (!Number.isFinite(dadosToken.exp) || dadosToken.exp * 1000 <= Date.now()) return null;
    if (dadosToken.nbf != null && dadosToken.nbf * 1000 > Date.now()) return null;

    switch (Number(usuario.tipoUsuario)) {
      case 1: return "/HomeClient";
      case 2: return "/HomeCaregiver";
      default: return null;
    }
  } catch {
    return null;
  }
}
