
-- Adiciona a coluna 'type' para categorizar o bem (Jet Ski, Carreta, etc)
ALTER TABLE fleet 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Jet Ski';

-- Adiciona a coluna 'is_active' para controle administrativo (Ativo/Inativo)
ALTER TABLE fleet 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
