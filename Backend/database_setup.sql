-- Script de configuração do banco de dados Supabase para Wolf Planner

-- Habilitar extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de clientes (vinculada ao auth.users do Supabase)
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de objetivos de investimento
CREATE TABLE objetivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de investimentos específicos
CREATE TABLE investimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  objetivo_id UUID REFERENCES objetivos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  valor DECIMAL(15,2) NOT NULL,
  tipo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_clientes_user_id ON clientes(user_id);
CREATE INDEX idx_objetivos_cliente_id ON objetivos(cliente_id);
CREATE INDEX idx_investimentos_objetivo_id ON investimentos(objetivo_id);

-- Habilitar RLS (Row Level Security) para segurança
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE objetivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE investimentos ENABLE ROW LEVEL SECURITY;

-- Política: Usuários só veem seus próprios clientes
CREATE POLICY "Usuarios veem apenas seus clientes" ON clientes
  FOR ALL USING (auth.uid() = user_id);

-- Política: Usuários só veem objetivos de seus clientes
CREATE POLICY "Usuarios veem objetivos de seus clientes" ON objetivos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM clientes 
      WHERE clientes.id = objetivos.cliente_id 
      AND clientes.user_id = auth.uid()
    )
  );

-- Política: Usuários só veem investimentos de seus objetivos
CREATE POLICY "Usuarios veem investimentos de seus objetivos" ON investimentos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM objetivos 
      JOIN clientes ON clientes.id = objetivos.cliente_id
      WHERE objetivos.id = investimentos.objetivo_id 
      AND clientes.user_id = auth.uid()
    )
  );

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at na tabela clientes
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();