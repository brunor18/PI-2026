import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomeClient } from "./pages/client/HomeClient.jsx";
import { RegistrosClient } from "./pages/client/RegistrosClient.jsx";
import { CuidadoresClient } from "./pages/client/CuidadoresClient.jsx";
import { AnotacoesClient } from "./pages/client/AnotacoesClient.jsx";
import { IAClient } from "./pages/client/IAClient.jsx";
import { HomeCaregiver } from "./pages/caregiver/HomeCaregiver.jsx";
import { ClientesCaregiver } from "./pages/caregiver/ClientesCaregiver.jsx";
import { PerfilCaregiver } from "./pages/caregiver/PerfilCaregiver.jsx";
import { AnotacoesCaregiver } from "./pages/caregiver/AnotacoesCaregiver.jsx";
import { Login } from "./pages/Login.jsx";
import { Cadastro } from "./pages/Cadastro.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { PerfilClient } from "./pages/client/PerfilClient.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/HomeClient" element={<HomeClient />} />
        <Route path="/PerfilClient" element={<PerfilClient />} />
        <Route path="/RegistrosClient" element={<RegistrosClient />} />
        <Route path="/CuidadoresClient" element={<CuidadoresClient />} />
        <Route path="/IAClient" element={<IAClient />} />
        <Route path="/AnotacoesClient" element={<AnotacoesClient />} />
        <Route path="/HomeCaregiver" element={<HomeCaregiver />} />
        <Route path="/ClientesCaregiver" element={<ClientesCaregiver />} />
        <Route path="/PerfilCaregiver" element={<PerfilCaregiver />} />
        <Route path="/AnotacoesCaregiver" element={<AnotacoesCaregiver />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}
