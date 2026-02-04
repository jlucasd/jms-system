
-- SCRIPT DE IMPORTAÇÃO DE DADOS (PLANILHA DEZEMBRO 2022)
-- Execute no SQL Editor do Supabase para inserir estes registros históricos.

BEGIN;

INSERT INTO rentals (client_name, client_cpf, client_phone, rental_date, rental_type, start_time, end_time, status, location, observations, payment_method, value) VALUES

-- 1. MARCIO ZEPPELINI (17/12)
('MARCIO ZEPPELINI', '', '1199653-7601', '2022-12-17', 'Diária/Meia', '00:00', '00:00', 'Concluído', 'LAGUNA', 'Horário: VER AGENDA. Obs: Controle de datas Márcio 17, 28 E 30/12/2022 ---- 7,8,22,28,29/01/2023 ----- 09, 11,12,25 E 26/02/2023. Pagamentos: 21/12/2022 3K100 | 06/02/2023 1k, 28/02/2023 1k, falta 1,4k', 'Pix', 600.00),

-- 2. RENAN COSTA JUSTINO
('RENAN COSTA JUSTINO', '', '48 99191-8738', '2022-12-17', 'Meia Diária', '15:00', '19:00', 'Concluído', 'LAGUNA', 'Pagamento 50%: 16/12/2022. Pagamento 50%: 17/12/2022', 'Pix', 350.00),

-- 3. MARCELO MARZOLA DONOFRIO
('MARCELO MARZOLA DONOFRIO', '', '48998226030', '2022-12-24', 'Meia Diária', '08:00', '14:00', 'Concluído', 'LAGUNA', 'Pagamento 50%: 20/12/2022. Pagamento 50%: 20/12/2022', 'Pix', 480.00),

-- 4. MARCIO ZEPPELINI (28/12)
('MARCIO ZEPPELINI', '', '1199653-7601', '2022-12-28', 'Diária/Meia', '00:00', '00:00', 'Concluído', 'LAGUNA', 'Horário: VER AGENDA. Obs: Controle de datas Márcio 17, 28 E 30/12/2022 ---- 7,8,22,28,29/01/2023 ----- 09, 11,12,25 E 26/02/2023. Pagamentos: 21/12/2022 3K100 | 06/02/2023 1k, 28/02/2023 1k, falta 1,4k', 'Pix', 600.00),

-- 5. ANDERSON FOIZER FLORZINO
('ANDERSON FOIZER FLORZINO', '', '4899647-9372', '2022-12-29', 'Meia Diária', '14:00', '18:00', 'Concluído', 'LAGUNA', 'Pagamento 50%: 11/12/2022. Pagamento 50%: 11/12/2022', 'Pix', 350.00),

-- 6. MARCIO ZEPPELINI (30/12)
('MARCIO ZEPPELINI', '', '1199653-7601', '2022-12-30', 'Diária/Meia', '00:00', '00:00', 'Concluído', 'LAGUNA', 'Horário: VER AGENDA. Obs: Controle de datas Márcio 17, 28 E 30/12/2022 ---- 7,8,22,28,29/01/2023 ----- 09, 11,12,25 E 26/02/2023. Pagamentos: 21/12/2022 3K100 | 06/02/2023 1k, 28/02/2023 1k, falta 1,4k', 'Pix', 600.00),

-- 7. VINICIUS BARRETO
('VINICIUS BARRETO', '', '4899985-8799', '2022-12-31', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pagamento 50%: 18/12/2022. Pagamento 50%: 26/12/2022', 'Pix', 600.00);

COMMIT;
