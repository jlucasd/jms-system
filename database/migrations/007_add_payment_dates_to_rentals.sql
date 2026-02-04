
-- Adiciona colunas para controle de datas de pagamento
ALTER TABLE rentals 
ADD COLUMN IF NOT EXISTS payment_date_1 DATE,
ADD COLUMN IF NOT EXISTS payment_date_2 DATE;
