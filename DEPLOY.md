# 🚀 Wolf Planner - Guia de Deploy Rápido

## 📋 Pré-requisitos
- Conta no GitHub
- Conta no Vercel (gratuita)
- Conta no Railway (gratuita)
- Projeto Supabase já configurado

## 🔄 Passo 1: Preparar o Repositório Git

```bash
# Na pasta raiz do projeto
git init
git add .
git commit -m "feat: Wolf Planner ready for deployment"

# Conectar ao GitHub (criar repositório primeiro)
git remote add origin https://github.com/SEU_USUARIO/wolf-planner.git
git branch -M main
git push -u origin main
```

## 🎯 Passo 2: Deploy do Backend (Railway)

### 2.1 Criar Conta no Railway
1. Acesse: https://railway.app
2. Login com GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub repo"
5. Conecte seu repositório `wolf-planner`
6. Na configuração, selecione a pasta `/Backend`

### 2.2 Configurar Variáveis de Ambiente no Railway
No painel do Railway, vá em "Variables" e adicione:

```
SUPABASE_URL=https://bkjimpowmyufyfcsbdxw.supabase.co
SUPABASE_SERVICE_KEY=sua_service_key_aqui
JWT_SECRET=gere_uma_string_aleatoria_segura_aqui
FRONTEND_URL=https://seu-app.vercel.app
```

### 2.3 Obter Chaves do Supabase
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto Wolf Planner
3. Vá em Settings > API
4. Copie a `service_role key` (não a anon key)

### 2.4 Gerar JWT Secret
```bash
openssl rand -hex 32
# ou use: https://generate-secret.vercel.app/32
```

## 🌐 Passo 3: Deploy do Frontend (Vercel)

### 3.1 Criar Conta no Vercel
1. Acesse: https://vercel.com
2. Login com GitHub
3. Clique em "New Project"
4. Importe seu repositório `wolf-planner`
5. Na configuração:
   - Framework Preset: Next.js
   - Root Directory: `Frontend`
   - Build Command: `pnpm build`
   - Output Directory: deixe em branco

### 3.2 Configurar Variáveis de Ambiente no Vercel
No painel do Vercel, vá em Settings > Environment Variables:

```
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app/api
NEXT_PUBLIC_SUPABASE_URL=https://bkjimpowmyufyfcsbdxw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_do_supabase
```

## 🔧 Passo 4: Conectar Frontend e Backend

### 4.1 Atualizar CORS no Railway
Após o deploy do Vercel, você terá uma URL como `https://wolf-planner-abc123.vercel.app`

1. Volte ao Railway
2. Atualize a variável `FRONTEND_URL` com a URL real do Vercel
3. O backend irá automaticamente permitir CORS para este domínio

### 4.2 Verificar URLs
- ✅ Frontend: `https://seu-app.vercel.app`
- ✅ Backend: `https://seu-backend.railway.app`
- ✅ API Docs: `https://seu-backend.railway.app/docs`

## 🧪 Passo 5: Testar a Aplicação

1. Acesse sua URL do Vercel
2. Crie uma conta nova
3. Faça login
4. Teste todas as funcionalidades:
   - ✅ Criar cliente
   - ✅ Criar objetivo
   - ✅ Adicionar investimento
   - ✅ Ver dashboard

## 🚨 Solução de Problemas

### Frontend não carrega
- Verifique as variáveis de ambiente no Vercel
- Confirme que a API_URL está correta
- Veja os logs no Vercel

### Backend não responde
- Verifique os logs no Railway
- Confirme as variáveis de ambiente
- Teste a URL: `https://seu-backend.railway.app/health`

### CORS Error
- Verifique se FRONTEND_URL está correto no Railway
- URLs devem incluir https://
- Redeploy o backend após alterar CORS

### Database Error
- Confirme as credenciais do Supabase
- Verifique se RLS está configurado
- Teste conexão no Supabase Dashboard

## 📊 Custos Estimados

| Serviço | Plano Gratuito |
|---------|----------------|
| Vercel | ✅ Até 100GB bandwidth |
| Railway | ✅ $5 crédito mensal |
| Supabase | ✅ Até 50MB storage |
| **Total** | **~$0-5/mês** |

## 🎉 Próximos Passos

Após o deploy:
- [ ] Configurar domínio personalizado
- [ ] Adicionar analytics
- [ ] Configurar backup automático
- [ ] Monitoramento de uptime
- [ ] Implementar CI/CD

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs das plataformas
2. Confirme todas as variáveis de ambiente
3. Teste localmente primeiro
4. Consulte a documentação das plataformas