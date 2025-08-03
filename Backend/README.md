# Wolf Planner Backend

API REST desenvolvida com FastAPI para gerenciamento de clientes e carteiras de investimento.

## Instalação

1. Criar ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

2. Instalar dependências:
```bash
pip install -r requirements.txt
```

3. Configurar variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Preencha com suas credenciais do Supabase

## Executar

```bash
uvicorn main:app --reload --port 8000
```

A API estará disponível em http://localhost:8000

## Documentação

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Criar cliente
- `GET /api/clientes/{id}` - Obter cliente
- `PUT /api/clientes/{id}` - Atualizar cliente
- `DELETE /api/clientes/{id}` - Deletar cliente

### Carteiras
- `GET /api/carteiras/cliente/{id}/objetivos` - Listar objetivos
- `POST /api/carteiras/objetivos` - Criar objetivo
- `GET /api/carteiras/objetivo/{id}/investimentos` - Listar investimentos
- `POST /api/carteiras/investimentos` - Criar investimento
- `GET /api/carteiras/cliente/{id}/completa` - Obter carteira completa