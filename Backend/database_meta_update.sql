-- Script para adicionar funcionalidade de metas aos objetivos
-- Execute este script no Supabase SQL Editor

-- Adicionar coluna valor_meta à tabela objetivos
ALTER TABLE objetivos 
ADD COLUMN valor_meta DECIMAL(15,2) NULL;

-- Adicionar comentário para documentação
COMMENT ON COLUMN objetivos.valor_meta IS 'Meta financeira opcional para o objetivo (pode ser NULL)';

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'objetivos' 
AND column_name = 'valor_meta';