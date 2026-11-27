<h1 align="center">Promedéri — PI 2026</h1>

<p align="center">
  <img src="Documents/fotosLogo/so-nome-removebg.png" alt="Logo Promedéri" width="200" height="230" />
</p>

> **Cuidar de quem você ama começa com estar perto!**  
> Plataforma de acompanhamento de saúde e rotina que conecta famílias (clientes/idosos) e cuidadores em um só lugar.
---

##  Sobre o Projeto

O **Promedéri** é uma aplicação web progressiva (**PWA**) desenvolvida como Projeto Integrador (PI 2026). Seu objetivo é centralizar informações clínicas, medicações, procedimentos cirúrgicos, anotações diárias e a comunicação entre pacientes/familiares e cuidadores, além de oferecer suporte inteligente por meio de um assistente virtual integrado à IA do **Google Gemini**.

###  Principais Funcionalidades

- **Autenticação e Perfis (`JWT` + `BCrypt`):** Cadastro e login com controle de acesso para dois perfis distintos: **Cliente (Paciente/Família)** e **Cuidador**.
- **Gestão de Saúde e Registros Clínicos:**
  - Controle de **Medicamentos** (horários, dosagens e observações).
  - Histórico de **Procedimentos Cirúrgicos**.
  - Acompanhamento de **Campos Clínicos** e sinais vitais.
- **Anotações Diárias (CRUD Completo):** Registro e acompanhamento do cotidiano do paciente compartilhado entre cliente e cuidador.
- **Conexão Cliente & Cuidador:**
  - Busca de clientes e cuidadores por nome ou cidade.
  - Envio, recebimento e gerenciamento de **propostas e vínculos** de cuidado (com controle de cache em memória e *Rate Limiting*).
- **Assistente Virtual com IA (`Google Gemini`):** Chat integrado para tirar dúvidas e auxiliar na rotina de cuidados.
- **Suporte PWA (*Progressive Web App*):** Instalável em dispositivos móveis e desktop, com *Service Worker* e cache offline para consultas rápidas.

---

##  Tecnologias Utilizadas

### Backend (`Promederi/backend`)
- **[.NET 10.0](https://dotnet.microsoft.com/)** (ASP.NET Core Web API)
- **Entity Framework Core 9.0** + **Pomelo MySQL** (ORM e Migrations)
- **MySQL 8.0** (Banco de Dados Relacional via Docker ou XAMPP)
- **Autenticação JWT** (`Microsoft.AspNetCore.Authentication.JwtBearer`) & **BCrypt.Net-Next**
- **Google GenAI SDK** (`Google.GenAI`) para integração com modelos Gemini

### Frontend (`Promederi/frontend`)
- **[React 19](https://react.dev/)** + **[Vite 8](https://vite.dev/)**
- **Tailwind CSS 3** + **Radix UI** + **Lucide Icons**
- **React Router DOM 7** (Roteamento SPA)
- **Axios** (Consumo da API REST)
- **Vite Plugin PWA** (Configuração de Manifesto e Workbox)

---

##  Estrutura do Repositório

```text
PI-2026/
├── Documents/                  # Documentação do projeto, diagramas UML, requisitos e coleções Postman
├── Promederi/
│   ├── backend/                # API REST em ASP.NET Core (.NET 10)
│   │   ├── Controllers/        # Endpoints da aplicação (Auth, Clientes, Cuidadores, Anotações, Chat, etc.)
│   │   ├── Data/               # Contexto do banco de dados (AppDbContext)
│   │   ├── DTO/                # Objetos de Transferência de Dados
│   │   ├── Migrations/         # Migrações do Entity Framework Core
│   │   ├── Models/             # Entidades de domínio
│   │   ├── Services/           # Serviços de negócio (GeminiService, PropostasCache)
│   │   └── docker-compose.yml  # Container MySQL 8.0 pronto para uso
│   └── frontend/               # Aplicação React + Vite (PWA)
│       └── src/
│           ├── assets/         # Imagens e recursos estáticos
│           ├── components/     # Componentes reutilizáveis de UI
│           ├── hooks/          # Custom Hooks
│           ├── pages/          # Telas divididas por fluxo (client, caregiver, Login, Cadastro, LandingPage)
│           └── services/       # Configuração de chamadas à API
└── PI-2026.sln                 # Solução do Visual Studio
```

---

##  Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- **[Node.js](https://nodejs.org/)** (v18.0 ou superior)
- **[.NET SDK 10.0](https://dotnet.microsoft.com/download)**
- **[Docker](https://www.docker.com/)** (recomendado para o banco de dados) ou **XAMPP / MySQL Server local**
- Ferramenta CLI do Entity Framework Core (caso ainda não tenha):
  ```bash
  dotnet tool install --global dotnet-ef
  ```

---

##  Como Executar o Projeto

### Passo 1: Clonar o repositório
```bash
git clone https://github.com/brunor18/PI-2026.git
cd PI-2026
```

### Passo 2: Configurar e iniciar o Banco de Dados (MySQL)

#### Opção A: Usando Docker (Recomendado)
Na pasta do backend, inicie o container do MySQL configurado no `docker-compose.yml`:
```bash
cd Promederi/backend
docker compose up -d
```
> Para desligar o container posteriormente e remover os volumes, utilize: `docker compose down -v`

#### Opção B: Usando XAMPP ou MySQL Local
Inicie o serviço do MySQL na porta `3306` e ajuste a string de conexão no arquivo `Promederi/backend/appsettings.json` (caso utilize o XAMPP padrão sem senha, deixe `password=` vazio):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;port=3306;database=promederiDB;user=root;password=12345"
  }
}
```

### Passo 3: Configurar variáveis do Backend (`appsettings.json`)
Verifique no arquivo `Promederi/backend/appsettings.json` se as chaves de configuração estão preenchidas:
- `ConnectionStrings:DefaultConnection`: Dados de acesso ao MySQL.
- `Jwt:Key`: Chave secreta para geração dos tokens JWT.
- `Gemini:ApiKey`: Chave de API do Google Gemini para o funcionamento do chat de IA.

### Passo 4: Instalar dependências e aplicar as Migrações no Backend
Ainda no diretório `Promederi/backend`:
```bash
dotnet restore
dotnet ef database update
```

### Passo 5: Iniciar o servidor Backend
```bash
dotnet watch
```
A API estará disponível em `http://localhost:5276`.

### Passo 6: Instalar dependências e iniciar o Frontend
Em um novo terminal, acesse a pasta do frontend:
```bash
cd Promederi/frontend
npm install
npm run dev
```
A aplicação web estará disponível em `http://localhost:5173` (com proxy configurado automaticamente para redirecionar chamadas `/api` para `http://localhost:5276`).

---

##  Documentação Adicional

Na pasta [`Documents/`](Documents/) você encontrará os artefatos de engenharia de software do projeto:
- Documentação geral do Projeto Integrador (`Documentacao-PI.docx`)
- Planilhas de Requisitos Funcionais, Não Funcionais e Suplementares
- Diagrama UML (`promederi-UML.png`)
- Coleções do Postman para testes dos endpoints (`Documents/postman_config_files/`)
