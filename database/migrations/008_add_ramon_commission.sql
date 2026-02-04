
-- Adiciona colunas para comissão do Ramon
ALTER TABLE rentals 
ADD COLUMN IF NOT EXISTS ramon_commission_check BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ramon_commission_value NUMERIC(10,2) DEFAULT 0;
