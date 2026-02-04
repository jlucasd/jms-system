
-- Renomeia as colunas de comissão para ficarem genéricas
ALTER TABLE rentals 
RENAME COLUMN ramon_commission_check TO commission_check;

ALTER TABLE rentals 
RENAME COLUMN ramon_commission_value TO commission_value;
