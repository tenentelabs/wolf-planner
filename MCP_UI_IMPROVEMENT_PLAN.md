# Plano de Melhorias de UI com Playwright MCP - Wolf Planner

## Status da Instalação ✅ RESOLVIDO
✅ **Playwright MCP configurado com Firefox + Isolated** em 2025-08-20
- ✅ Dependências do sistema instaladas (libnspr4, libnss3, libasound2t64)
- ✅ Browsers Playwright instalados (Chrome, Firefox, WebKit)
- ✅ Conflitos de Chrome resolvidos (link simbólico removido)
- ✅ Cache MCP limpo completamente
- ✅ Configuração atualizada: `--browser firefox --isolated`
- **Status**: Pronto para uso após reiniciar Claude Code

## Contexto do Projeto
- **Projeto**: Wolf Planner
- **Localização**: `/home/rafaelgk/Projetos/Wolf Planner`
- **Frontend**: Next.js com TypeScript (pasta `Frontend/`)
- **Backend**: FastAPI com Python (pasta `Backend/`)
- **Objetivo Principal**: Aperfeiçoar a UI para maior polidez e responsividade

## Tarefas Executadas ✅
1. ✅ **Instalar Playwright MCP** - Concluído
2. ✅ **Resolver dependências do sistema** - libnspr4, libnss3, libasound2t64 instaladas
3. ✅ **Resolver conflitos Chrome/Firefox** - Link simbólico removido, cache limpo
4. ✅ **Configurar Firefox + Isolated** - `.claude.json` atualizado

## Próximas Tarefas (APÓS REINICIAR) 🎯

### 1. ⏳ Verificar MCP funcionando com Firefox
- Testar `mcp__playwright__browser_navigate` com Firefox
- Confirmar que não há erro "Browser is already in use"

### 2. ⏳ Servidor de desenvolvimento (SE NECESSÁRIO)
```bash
cd "/home/rafaelgk/Projetos/Wolf Planner/Frontend"
pnpm dev  # Servidor em http://localhost:3000
```

### 3. ⏳ Navegar e capturar estado inicial
- `mcp__playwright__browser_navigate("http://localhost:3000")`
- Screenshot inicial da aplicação
- Verificar carregamento correto

### 4. ⏳ Auditoria Multi-Device
- **Mobile**: 375px (iPhone SE/12 mini)
- **Tablet**: 768px (iPad)  
- **Desktop**: 1440px (padrão moderno)
- Screenshots e análise de cada viewport

### 5. ⏳ Análise de Páginas Críticas
- Login/Register (`/login`, `/register`)
- Dashboard (`/`)
- Clientes (`/clientes`)
- Carteira (`/carteira/[clienteId]`)

### 6. ⏳ Implementar Melhorias Identificadas
- Corrigir problemas de responsividade
- Melhorar breakpoints Tailwind
- Otimizar componentes Shadcn/ui

## Fluxos a Testar

### Páginas Principais
1. **Home** (`/`)
2. **Login** (`/login`)
3. **Register** (`/register`)
4. **Dashboard** (`/dashboard/[clienteId]`)
5. **Clientes** (`/clientes`)
6. **Carteira** (`/carteira/[clienteId]`)

### Elementos Críticos para Análise
- Formulários (validação, feedback visual)
- Tabelas (responsividade, ações)
- Cards (alinhamento, espaçamento)
- Botões (estados hover, active, disabled)
- Navegação (menu, breadcrumbs)
- Tipografia (hierarquia, legibilidade)
- Cores (contraste, consistência)
- Animações (transições suaves)

## Comandos MCP Disponíveis Após Reiniciar

O Playwright MCP fornecerá comandos como:
- `playwright_navigate` - Navegar para URLs
- `playwright_click` - Clicar em elementos
- `playwright_fill` - Preencher formulários
- `playwright_screenshot` - Capturar telas
- `playwright_evaluate` - Executar JavaScript
- `playwright_select_option` - Selecionar opções
- `playwright_wait_for` - Aguardar elementos

## Configuração Atual do MCP 🔧
```json
// /home/rafaelgk/.claude.json
"mcpServers": {
  "playwright": {
    "type": "stdio",
    "command": "npx",
    "args": [
      "@playwright/mcp@latest",
      "--browser", "firefox",
      "--isolated"
    ]
  }
}
```

## Problema Resolvido ✅
- **Erro anterior**: "Browser is already in use for mcp-chrome-*"
- **Causa**: Conflito entre Chrome system e configuração MCP
- **Solução**: Firefox + Isolated mode + limpeza completa

## Status do Servidor de Desenvolvimento
- **Localização**: `/home/rafaelgk/Projetos/Wolf Planner/Frontend`
- **Comando**: `pnpm dev`
- **URL**: http://localhost:3000
- **Status**: Verificar se ainda está rodando após reiniciar

---

## 🚀 COMANDO PARA RETOMAR APÓS REINICIAR

Digite exatamente isto quando reabrir o Claude Code:

**"Vamos continuar com a auditoria UI do Wolf Planner usando Firefox MCP. O servidor está configurado e pronto."**

O Claude retomará automaticamente a partir da navegação com Firefox, sem conflitos de browser.