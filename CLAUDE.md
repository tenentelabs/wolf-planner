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
  valor_meta?: number  // Meta financeira opcional
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
- ✅ Metas opcionais para objetivos com progress tracking
- ✅ Dashboard com visualizações e progresso de metas
- ✅ Interface responsiva (mobile otimizado)
- ✅ Formulários com validação
- ✅ Autenticação completa (Login/Registro/Logout)
- ✅ Proteção de rotas
- ✅ Dark mode / Light mode
- ✅ Toast notifications elegantes
- ✅ Design sofisticado e moderno
- ✅ Animações e micro-interações
- ✅ Modais de confirmação customizados
- ✅ Navegação breadcrumb
- ✅ **UI Responsiva Avançada**: Header adaptativo, navegação contextual por viewport
- ✅ **Loading States Inteligentes**: SmartSkeleton, StaggeredContainer, FadeInCard
- ✅ **API Optimization**: Hook useClienteData com cache de 30s, prevenção de duplicação
- ✅ **Accessibility**: Focus states aprimorados, keyboard navigation, screen reader support

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

## Componentes UI Avançados

### Loading States (/components/ui/loading-states.tsx)
```typescript
// SmartSkeleton - Skeleton inteligente com variants
<SmartSkeleton variant="card" className="min-h-48" />
<SmartSkeleton className="h-6 w-48" />

// StaggeredContainer - Animações sequenciais
<StaggeredContainer>
  <StaggeredItem delay={0.1}>Card 1</StaggeredItem>
  <StaggeredItem delay={0.2}>Card 2</StaggeredItem>
</StaggeredContainer>

// FadeInCard - Cards com animação de entrada
<FadeInCard delay={0.3}>Conteúdo</FadeInCard>
```

### API Optimization Hook (/hooks/use-cliente-data.ts)
```typescript
// Hook otimizado com cache de 30s
const { cliente, objetivos, loading, error, refreshData } = useClienteData(clienteId)

// Funcionalidades:
- Cache inteligente (30s)
- Prevenção de requests duplicados  
- Parallel data fetching
- Error handling robusto
- Refresh manual
```

### Header Responsivo (/components/layout/header.tsx)
```typescript
// Logo responsivo
<span className="hidden sm:inline">Wolf Planner</span>
<span className="sm:hidden">WP</span>

// Navegação adaptativa
<span className="hidden sm:inline">Texto do botão</span>
// Mobile: apenas ícones | Desktop: ícones + texto
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
11. ✅ Deploy completo em produção (Railway)
12. ✅ Funcionalidade de metas opcionais
13. ✅ Progress bars e indicadores visuais
14. ✅ Otimizações de responsividade mobile
15. ✅ Sistema de confirmação elegante
16. ✅ **Overflow horizontal eliminado**: Header responsivo com logo "WP" em mobile
17. ✅ **Loading states avançados**: SmartSkeleton, animações staggered
18. ✅ **Otimização de APIs**: Hook useClienteData com cache inteligente
19. ✅ **Acessibilidade aprimorada**: Focus states, navegação por teclado
20. ✅ **Validação mobile completa**: Testado via Playwright MCP em 375px/768px/1440px

### Melhorias Futuras (Opcional)
- 📊 Gráficos mais avançados (Chart.js/Recharts)
- 📱 PWA (Progressive Web App)
- 📄 Exportação de relatórios (PDF/Excel)
- ⏰ Metas com prazos (deadlines)
- 📧 Notificações por email
- 🔄 Sincronização em tempo real
- 💰 Comparação com inflação/CDI
- 🎯 Alertas de meta próxima do vencimento
- 📈 Histórico de evolução dos investimentos

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

### Frontend (.env.local ou .env.production)
```
# Desenvolvimento
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SUPABASE_URL=https://bkjimpowmyufyfcsbdxw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Produção
NEXT_PUBLIC_API_URL=https://wolf-planner-production.up.railway.app/api
```

### Backend (.env)
```
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
JWT_SECRET=
```

## Performance e Troubleshooting

### Otimizações Implementadas
- **Autenticação otimizada**: Timeout reduzido (8s), retry strategy (2 tentativas), fallback de cache
- **Logging condicional**: Logs detalhados apenas em desenvolvimento para reduzir overhead em produção
- **Gerenciamento de tokens**: Múltiplos fallbacks (localStorage, sessionStorage, cookies)
- **Interface responsiva**: Breakpoints otimizados para mobile/tablet/desktop
- **Header responsivo**: Logo adaptativo ("Wolf Planner" → "WP"), navegação contextual (texto completo ↔ ícones)
- **Loading states inteligentes**: SmartSkeleton com variants, StaggeredContainer para animações sequenciais
- **API caching**: Hook useClienteData com cache de 30s, prevenção de duplicação de chamadas
- **Overflow prevention**: Eliminação completa de scroll horizontal em mobile (375px validated)

### Problemas Comuns e Soluções

#### Login não funciona após registro
- **Causa**: Delay na propagação do token/sessão
- **Solução**: Implementado retry automático com fallback de cache

#### Não consegue deletar metas de objetivos
- **Causa**: Backend filtrava valores null em updates
- **Solução**: Backend modificado para incluir explicitamente valor_meta mesmo quando null

#### Carregamento lento ("Verificando autenticação")
- **Causa**: Logs excessivos e timeouts longos em produção
- **Solução**: Logging condicional e timeout otimizado

#### Desconectado ao atualizar página
- **Verificação**: Checar se tokens estão sendo persistidos corretamente
- **Solução**: Verificar configuração de cookies e localStorage

#### Overflow horizontal em mobile (RESOLVIDO)
- **Causa**: Header com largura fixa, elementos ultrapassando viewport de 375px
- **Solução**: Header responsivo implementado com logo "WP" e navegação icon-only em mobile

#### Camada branca bloqueando interface (RESOLVIDO)  
- **Causa**: CSS rules problemáticas (container min-height, space-y gaps)
- **Solução**: Remoção das regras conflitantes, layout mobile otimizado

### Deploy e Monitoramento
- **Plataforma**: Railway (auto-deploy no push para main)
- **Logs**: Acessíveis via Railway dashboard
- **URLs**:
  - Frontend: https://wolf-planner-frontend-production-f6dc.up.railway.app
  - Backend: https://wolf-planner-production-5eda.up.railway.app

## 🎭 Playwright MCP - Protocolo de Desenvolvimento UI

### Configuração do Playwright MCP
- **Browser**: Firefox (configurado e validado)
- **Viewports padrão**: 375px (mobile), 768px (tablet), 1440px (desktop)
- **Ferramentas disponíveis**: Navegação, screenshots, snapshots, interação, avaliação JavaScript

### System Prompt para Desenvolvimento UI

**IMPORTANTE**: Todas as mudanças de design do frontend devem seguir este protocolo obrigatório:

#### 1. 📋 **PRÉ-IMPLEMENTAÇÃO** (Análise com Playwright MCP)
```
ANTES de implementar qualquer mudança de UI/UX:
1. Use Playwright MCP para navegar e analisar o estado atual
2. Capture screenshots/snapshots dos componentes afetados
3. Teste em todos os viewports (375px, 768px, 1440px)
4. Identifique possíveis problemas de layout, overflow, acessibilidade
5. Documente o estado atual e problemas encontrados
```

#### 2. 🔧 **IMPLEMENTAÇÃO** (Desenvolvimento Orientado)
```
Durante a implementação:
1. Implemente as mudanças baseadas na análise prévia
2. Foque em resolver os problemas identificados
3. Mantenha compatibilidade responsiva
4. Preserve funcionalidades existentes
```

#### 3. ✅ **PÓS-IMPLEMENTAÇÃO** (Validação com Playwright MCP)
```
APÓS implementar mudanças de UI/UX:
1. Use Playwright MCP para testar a implementação
2. Valide em todos os viewports obrigatoriamente
3. Teste interações (cliques, navegação, formulários)
4. Verifique se problemas anteriores foram resolvidos
5. IDENTIFIQUE AUTOMATICAMENTE novos problemas ou melhorias necessárias
6. Se problemas forem encontrados, IMPLEMENTE correções imediatamente
7. Documente o resultado final e suggest próximas otimizações
```

#### 4. 🔄 **Ciclo Contínuo de Melhoria**
```
Após cada validação:
1. Se novos problemas foram identificados → volte para implementação
2. Se melhorias óbvias foram detectadas → sugira próximas iterações
3. Documente lições aprendidas no CLAUDE.md
4. Atualize guidelines de desenvolvimento
```

### Comandos Playwright MCP Essenciais
```javascript
// Navegação e sizing
await page.goto('http://localhost:3001/...')
await page.setViewportSize({ width: 375, height: 667 })

// Análise de overflow
await page.evaluate(() => ({
  hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
  viewport: { width: window.innerWidth, height: window.innerHeight }
}))

// Testes de responsividade
await page.screenshot({ fullPage: true })
await page.getByRole('button', { name: 'Botão' }).click()
```

### Lições Aprendidas
- **Overflow horizontal**: Headers fixos são problemáticos em mobile
- **Loading states**: SmartSkeleton melhora UX significativamente  
- **API optimization**: Caching previne requests desnecessários
- **Responsividade**: Logo e navegação precisam ser contextuais ao viewport

## Notas de Segurança
- Dados financeiros sensíveis requerem autenticação
- Implementar RLS no Supabase para isolamento de dados
- Nunca commitar credenciais ou chaves de API
- Validar todos os inputs no frontend e backend