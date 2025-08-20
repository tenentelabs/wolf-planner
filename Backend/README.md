# Wolf Planner Backend

API REST desenvolvida com FastAPI para gerenciamento de clientes e carteiras de investimento financeiro.

## 🏗️ Arquitetura

### Stack Tecnológico
- **Framework**: FastAPI 0.115.6
- **Servidor**: Uvicorn (ASGI)
- **Banco de Dados**: PostgreSQL via Supabase
- **Autenticação**: Supabase Auth (JWT)
- **Validação**: Pydantic 2.10.4
- **Deploy**: Railway Platform

### Estrutura do Projeto
```
Backend/
├── app/
│   ├── __init__.py
│   ├── auth.py              # Middleware de autenticação JWT
│   ├── config.py            # Configurações da aplicação
│   ├── database.py          # Conexão com Supabase
│   ├── models.py            # Modelos Pydantic (schemas)
│   └── routers/
│       ├── __init__.py
│       ├── auth.py          # Endpoints de autenticação
│       ├── carteiras.py     # Endpoints de carteiras/objetivos
│       └── clientes.py      # Endpoints de clientes
├── main.py                  # Entrada da aplicação
├── requirements.txt         # Dependências Python
├── railway.json            # Configuração Railway
├── Procfile               # Comando de deploy
├── database_setup.sql     # Script inicial do banco
└── database_meta_update.sql # Update para funcionalidade de metas
```

## 🚀 Instalação e Configuração

### 1. Ambiente Virtual
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

### 2. Dependências
```bash
pip install -r requirements.txt
```

### 3. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do Backend:
```env
# Supabase
SUPABASE_URL=https://bkjimpowmyufyfcsbdxw.supabase.co
SUPABASE_SERVICE_KEY=your_service_key_here
JWT_SECRET=your_jwt_secret_here

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:3000
```

### 4. Banco de Dados
Execute os scripts SQL no Supabase:
1. `database_setup.sql` - Criação de tabelas e políticas RLS
2. `database_meta_update.sql` - Adiciona funcionalidade de metas

## 🔧 Execução

### Desenvolvimento
```bash
uvicorn main:app --reload --port 8000
```

### Produção
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

## 📚 Documentação da API

### URLs da Documentação
- **Desenvolvimento**: http://localhost:8000/docs (Swagger UI)
- **Produção**: https://wolf-planner-production-5eda.up.railway.app/docs
- **ReDoc**: `/redoc` (interface alternativa)

### Health Check
- `GET /` - Status básico da API
- `GET /health` - Health check para monitoramento

## 🔐 Autenticação

### Sistema de Autenticação
- **Provedor**: Supabase Auth
- **Tipo**: JWT Bearer Token
- **Headers**: `Authorization: Bearer <token>`

### Endpoints de Autenticação
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com", 
  "password": "password123"
}
```

```http
GET /api/auth/me
Authorization: Bearer <token>
```

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

## 📊 Endpoints Principais

### Clientes
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `GET` | `/api/clientes` | Listar todos os clientes do usuário | ✅ |
| `POST` | `/api/clientes` | Criar novo cliente | ✅ |
| `GET` | `/api/clientes/{id}` | Obter cliente específico | ✅ |
| `PUT` | `/api/clientes/{id}` | Atualizar cliente | ✅ |
| `DELETE` | `/api/clientes/{id}` | Deletar cliente | ✅ |

### Carteiras e Objetivos
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `GET` | `/api/carteiras/cliente/{id}/objetivos` | Listar objetivos do cliente | ✅ |
| `POST` | `/api/carteiras/objetivos` | Criar objetivo | ✅ |
| `PUT` | `/api/carteiras/objetivos/{id}` | Atualizar objetivo (incluindo metas) | ✅ |
| `DELETE` | `/api/carteiras/objetivos/{id}` | Deletar objetivo | ✅ |
| `GET` | `/api/carteiras/cliente/{id}/completa` | Carteira completa (objetivos + investimentos) | ✅ |

### Investimentos
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `GET` | `/api/carteiras/objetivo/{id}/investimentos` | Listar investimentos do objetivo | ✅ |
| `POST` | `/api/carteiras/investimentos` | Criar investimento | ✅ |
| `PUT` | `/api/carteiras/investimentos/{id}` | Atualizar investimento | ✅ |
| `DELETE` | `/api/carteiras/investimentos/{id}` | Deletar investimento | ✅ |

## 🗄️ Modelos de Dados

### Cliente
```json
{
  "id": "uuid",
  "nome": "string",
  "email": "string",
  "telefone": "string (optional)",
  "user_id": "uuid",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Objetivo
```json
{
  "id": "uuid",
  "nome": "string",
  "valor_meta": "number (optional)",
  "cliente_id": "uuid", 
  "created_at": "datetime"
}
```

### Investimento
```json
{
  "id": "uuid",
  "nome": "string",
  "valor": "number",
  "tipo": "string (optional)",
  "objetivo_id": "uuid",
  "created_at": "datetime"
}
```

## 🔒 Segurança

### Row Level Security (RLS)
- **Isolamento de dados**: Usuários só acessam seus próprios dados
- **Políticas automáticas**: Aplicadas no nível do banco de dados
- **Cascata de permissões**: Clientes → Objetivos → Investimentos

### CORS
- **Desenvolvimento**: `localhost:3000`, `localhost:3001`
- **Produção**: Configurado via `FRONTEND_URL`
- **Credentials**: Permitido para autenticação

### Tratamento de Dados Sensíveis
- **Decimais**: Conversão automática `Decimal → float`
- **Valores nulos**: Suporte explícito para remoção de metas
- **Validação**: Pydantic em todas as entradas

## 🚀 Deploy

### Railway Platform
- **Auto-deploy**: Push para `main` → deploy automático
- **URL Produção**: https://wolf-planner-production-5eda.up.railway.app
- **Health Check**: Configurado em `/health`
- **Restart Policy**: ON_FAILURE (3 tentativas)

### Configuração Railway
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## 🐛 Troubleshooting

### Problemas Comuns

#### Erro de Autenticação
```
401 Unauthorized
```
- **Causa**: Token expirado ou inválido
- **Solução**: Renovar token via login

#### Meta não removida
```
Objetivo permanece com meta mesmo enviando null
```
- **Causa**: Backend filtrava valores null (corrigido)
- **Solução**: Atualizada v1.1 - suporte explícito a null

#### CORS Error
```
Access-Control-Allow-Origin error
```
- **Causa**: Frontend URL não configurada
- **Solução**: Definir `FRONTEND_URL` no ambiente

### Logs e Monitoramento
- **Railway Logs**: Acessível via dashboard Railway
- **Health Check**: `GET /health` para status
- **Errors**: Logs estruturados com status HTTP apropriados

## 📝 Changelog

### v1.1 (Atual)
- ✅ Suporte completo para metas opcionais (null values)
- ✅ Correção de filtros em updates
- ✅ Melhor tratamento de Decimal → float
- ✅ Health check endpoint

### v1.0
- ✅ API básica completa (CRUD)
- ✅ Autenticação Supabase
- ✅ Deploy Railway
- ✅ RLS implementado

## 🔗 Links Úteis

- **API Produção**: https://wolf-planner-production-5eda.up.railway.app
- **Documentação**: https://wolf-planner-production-5eda.up.railway.app/docs
- **Supabase Dashboard**: https://bkjimpowmyufyfcsbdxw.supabase.co
- **Railway Dashboard**: https://railway.app/project/[project-id]