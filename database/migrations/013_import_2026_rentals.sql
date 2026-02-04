
-- IMPORTAÇÃO DE LOCAÇÕES DE 2026
-- Este script insere os dados de 2026, tratando duplicidades e comissões.

BEGIN;

-- 1. MURILO SOARES MENDES (01/01/2026)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, commission_check, commission_value)
SELECT 'MURILO SOARES MENDES', '4899918-9576', '2026-01-01', 'Diária', '10:00', '18:00', 'Concluído', 'Jaguaruna / Esteves', 'Pix', 800.00, '2025-12-17', TRUE, 200.00
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MURILO SOARES MENDES' AND rental_date = '2026-01-01');

-- 2. RENAN SCHUTZ (02/01/2026)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, commission_check, commission_value, observations)
SELECT 'RENAN SCHUTZ', '48996967641', '2026-01-02', 'Diária', '10:00', '18:00', 'Concluído', 'JAGUARUNA', 'Pix', 800.00, '2025-12-18', TRUE, 200.00, 'FECHADO POR MANOEL'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'RENAN SCHUTZ' AND rental_date = '2026-01-02');

COMMIT;
