import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/client/HomeClient';
import CuidadoresClient from './pages/client/CuidadoresClient';
import AnotacoesClient from './pages/client/AnotacoesClient';
import IAClient from './pages/client/IAClient';

import HomeCaregiver from './pages/caregiver/HomeCaregiver';
import ClientesCaregiver from './pages/caregiver/ClientesCaregiver';
import PerfilCaregiver from './pages/caregiver/PerfilCaregiver';
import AnotacoesCaregiver from './pages/caregiver/AnotacoesCaregiver';

import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/CuidadoresClient" element={<CuidadoresClient />} />
        <Route path="/IAClient" element={<IAClient />} />
        <Route path="/AnotacoesClient" element={<AnotacoesClient />} />

        <Route path="/HomeCaregiver" element={<HomeCaregiver />} />
        <Route path="/ClientesCaregiver" element={<ClientesCaregiver />} />
        <Route path="/PerfilCaregiver" element={<PerfilCaregiver />} />
        <Route path="/AnotacoesCaregiver" element={<AnotacoesCaregiver />} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}