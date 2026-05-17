Projeto PI 2026: promederi


##  Instalação

### Pré-requisitos
- Node.js 18.0 ou superior
- .NET 10


**Passo 1: Clone o repositório**
 ```bash
    git clone https://github.com/brunor18/PI-2026
```

**Passo 2: Instale as dependências do backend**
 ```bash
    cd Promederi/backend
    dotnet restore
```

**Passo 3: Instale as dependências do frontend**
 ```bash
    cd Promederi/frontend
    npm i
```

**Passo 4: Iniciar servidor backend**
 ```bash
    cd Promederi/backend
    dotnet watch
```

**Passo 5: Iniciar servidor frontend**
 ```bash
    npm run dev 
```

##  Configuração do docker
Iniciar composer do docker:

 ```bash
    docker compose up -d
```

Desligar composer
 ```bash
    docker compose down -v 
``` 

## appsettings.json:
<b>IMPORTANTE</b>: se quiser usar o xampp, deixe o campo password vazio

```json
    {
        "ConnectionStrings": {
            "DefaultConnection": "server=localhost;port=3306;database=promederiDB;user=root;password=12345"
        }
    }
``` 