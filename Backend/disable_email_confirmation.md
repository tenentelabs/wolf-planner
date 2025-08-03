# Como Desabilitar Confirmação de Email no Supabase (Desenvolvimento)

Para facilitar o desenvolvimento, você pode desabilitar temporariamente a confirmação de email:

## Opção 1: Via Dashboard do Supabase (Recomendado)

1. Acesse: https://app.supabase.com/project/bkjimpowmyufyfcsbdxw
2. Vá para: **Authentication** > **Providers**
3. Clique em **Email** 
4. Desmarque: **"Confirm email"**
5. Salve as alterações

## Opção 2: Usando SQL no Supabase

1. No dashboard do Supabase, vá para **SQL Editor**
2. Execute:

```sql
-- Desabilitar confirmação de email para novos usuários
UPDATE auth.config 
SET email_confirm_required = false;
```

## Opção 3: Configuração Programática

Se preferir manter a confirmação mas fazer auto-confirmação:

```python
# Em database.py, adicionar função para auto-confirmar usuários
from supabase import create_client, Client
from app.config import settings

# Criar cliente admin (requer service key)
admin_client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_KEY  # Precisa adicionar esta key
)

# Após criar usuário, auto-confirmar
admin_client.auth.admin.update_user_by_id(
    user_id,
    {"email_confirmed_at": datetime.now().isoformat()}
)
```

## Recomendação

Para desenvolvimento, use a **Opção 1** - é mais simples e reversível.

Lembre-se de reativar a confirmação de email antes de ir para produção!