using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Promederi.Controllers;

public abstract class UsuarioControllerBase : ControllerBase
{
    protected bool usuarioTemAcesso(int usuarioId)
    {
        return User.FindFirst("token_type")?.Value == "access"
            && int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var id)
            && id == usuarioId;
    }
}
