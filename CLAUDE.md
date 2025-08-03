# Wolf Planner - Documentação do Projeto

## Visão Geral
Wolf Planner é uma aplicação de planejamento financeiro que permite gerenciar clientes e suas carteiras de investimentos organizadas por objetivos.

## Stack Tecnológico

### Frontend
- **Framework**: Next.js 15.2.4 com App Router
- **Linguagem**: TypeScript 5
- **UI**: Shadcn/ui (Radix UI components)
- **Estilização**: Tailwind CSS v4
- **Formulários**: React Hook Form + Zod
- **Ícones**: Lucide React
- **Animações**: Framer Motion
- **Tema**: Next-themes (Dark/Light mode)
- **Tipografia**: Inter + Playfair Display
- **Gerenciador de Pacotes**: pnpm

### Backend (implementado)
- **Framework**: FastAPI (Python)
- **Banco de Dados**: PostgreSQL via Supabase
- **Autenticação**: Supabase Auth
- **Cliente Python**: supabase-py
- **Validação**: Pydantic
- **Servidor**: Uvicorn

## Estrutura de Dados

```typescript
interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
}

interface Objetivo {
  id: string
  nome: string
  investimentos: Investimento[]
}

interface Investimento {
  id: string
  nome: string
  valor: number
}

interface ClienteCarteira {
  clienteId: string
  objetivos: Objetivo[]
}
```

## Funcionalidades Principais

### Implementadas (Frontend)
- ✅ Gestão de clientes (CRUD)
- ✅ Gestão de objetivos de investimento
- ✅ Gestão de investimentos por objetivo
- ✅ Dashboard com visualizações
- ✅ Interface responsiva
- ✅ Formulários com validação
- ✅ Autenticação completa (Login/Registro/Logout)
- ✅ Proteção de rotas
- ✅ Dark mode / Light mode
- ✅ Toast notifications
- ✅ Design sofisticado e moderno
- ✅ Animações e micro-interações

### Implementadas (Backend)
- ✅ API REST com FastAPI
- ✅ Autenticação via Supabase Auth
- ✅ Persistência de dados no PostgreSQL
- ✅ Segurança com RLS (Row Level Security)
- ✅ CRUD completo para clientes
- ✅ CRUD completo para objetivos e investimentos
- ✅ Endpoints protegidos com JWT
- ✅ Documentação automática (Swagger/ReDoc)

## Estrutura de Pastas

```
Wolf Planner/
├── Frontend/
│   ├── app/              # Páginas Next.js (App Router)
│   │   ├── (auth)/      # Rotas de autenticação
│   │   ├── clientes/    # Gestão de clientes
│   │   ├── carteira/    # Gestão de carteiras
│   │   └── dashboard/   # Analytics e relatórios
│   ├── components/       # Componentes React
│   │   ├── ui/          # Componentes Shadcn/ui
│   │   ├── layout/      # Header, navegação
│   │   ├── auth/        # Componentes de autenticação
│   │   ├── animations/  # Componentes de animação
│   │   └── theme-toggle/ # Toggle dark/light mode
│   ├── contexts/         # React Contexts
│   │   ├── auth-context.tsx    # Context de autenticação
│   │   └── toast-context.tsx   # Context de notifications
│   ├── lib/             # Utilitários e APIs
│   │   └── api/         # Serviços de API
│   ├── types/           # Definições TypeScript
│   └── public/          # Assets estáticos
└── Backend/
    ├── app/              # Código da aplicação
    │   ├── routers/     # Endpoints da API
    │   ├── auth.py      # Autenticação
    │   ├── config.py    # Configurações
    │   ├── database.py  # Conexão Supabase
    │   └── models.py    # Modelos Pydantic
    ├── main.py          # Entrada da aplicação
    └── requirements.txt # Dependências Python
```

## Rotas da Aplicação

- `/` - Página inicial (protegida)
- `/login` - Autenticação de usuário
- `/register` - Cadastro de usuário
- `/clientes` - Listagem e gestão de clientes (protegida)
- `/carteira/[clienteId]` - Gestão da carteira do cliente (protegida)
- `/dashboard/[clienteId]` - Dashboard analítico (protegida)

## Decisões Técnicas

1. **Supabase para Backend**: Escolhido pela segurança integrada, facilidade de uso e recursos prontos
2. **FastAPI**: Framework Python moderno para familiarização com a tecnologia
3. **Autenticação Supabase**: Sistema robusto e testado para dados sensíveis
4. **Shadcn/ui**: Componentes acessíveis e customizáveis
5. **Design System**: Paleta de cores sofisticada com suporte a dark mode
6. **Tipografia**: Combinação Inter (funcional) + Playfair Display (elegante)
7. **Micro-interações**: Framer Motion para animações suaves

## Status do Projeto

### Concluído ✅
1. ✅ Configurar projeto no Supabase
2. ✅ Criar estrutura de tabelas no PostgreSQL
3. ✅ Desenvolver API FastAPI com autenticação
4. ✅ Integrar frontend com backend
5. ✅ Implementar RLS para segurança adicional
6. ✅ Sistema de autenticação completo
7. ✅ Design sofisticado e moderno
8. ✅ Dark mode / Light mode
9. ✅ Toast notifications
10. ✅ Animações e micro-interações

### Melhorias Futuras (Opcional)
- 📊 Gráficos mais avançados (Chart.js/Recharts)
- 📱 PWA (Progressive Web App)
- 📄 Exportação de relatórios (PDF/Excel)
- 🎯 Metas de investimento com progresso
- 📧 Notificações por email
- 🔄 Sincronização em tempo real

## Credenciais Supabase (Desenvolvimento)

- **Project URL**: https://bkjimpowmyufyfcsbdxw.supabase.co
- **Anon Key**: Configurada no arquivo .env

## Comandos Úteis

### Frontend
```bash
cd Frontend
pnpm install      # Instalar dependências
pnpm dev         # Rodar em desenvolvimento
pnpm build       # Build de produção
```

### Backend
```bash
cd Backend
python -m venv venv              # Criar ambiente virtual
source venv/bin/activate         # Ativar ambiente (Linux/Mac)
# ou
venv\Scripts\activate           # Ativar ambiente (Windows)
pip install -r requirements.txt  # Instalar dependências
uvicorn main:app --reload --port 8000  # Rodar servidor
```

## Variáveis de Ambiente Necessárias

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SUPABASE_URL=https://bkjimpowmyufyfcsbdxw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Backend (.env)
```
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
JWT_SECRET=
```

## Notas de Segurança
- Dados financeiros sensíveis requerem autenticação
- Implementar RLS no Supabase para isolamento de dados
- Nunca commitar credenciais ou chaves de API
- Validar todos os inputs no frontend e backend