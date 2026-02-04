
-- IMPORTAÇÃO DE LOCAÇÕES DE 2023
-- Este script insere os dados históricos apenas se não existirem (com base em Cliente + Data).

BEGIN;

-- 1. VINICIUS BARRETO - 01/01/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'VINICIUS BARRETO', '4899985-8799', '2023-01-01', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pix', 600.00, '2022-12-18', '2022-12-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'VINICIUS BARRETO' AND rental_date = '2023-01-01');

-- 2. ANDERSON MEZARI DA SILVA JUNIOR - 13/01/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ANDERSON MEZARI DA SILVA JUNIOR', '4898823-5596', '2023-01-13', 'Diária', '10:00', '18:00', 'Concluído', 'IMARUÍ', 'Pix', 600.00, '2022-12-08', '2022-12-12'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ANDERSON MEZARI DA SILVA JUNIOR' AND rental_date = '2023-01-13');

-- 3. ANDERSON MEZARI DA SILVA JUNIOR - 14/01/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ANDERSON MEZARI DA SILVA JUNIOR', '4898823-5596', '2023-01-14', 'Diária', '10:00', '18:00', 'Concluído', 'IMARUÍ', 'Pix', 600.00, '2022-12-08', '2022-12-12'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ANDERSON MEZARI DA SILVA JUNIOR' AND rental_date = '2023-01-14');

-- 4. ANDERSON MEZARI DA SILVA JUNIOR - 15/01/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ANDERSON MEZARI DA SILVA JUNIOR', '4898823-5596', '2023-01-15', 'Diária', '10:00', '18:00', 'Concluído', 'IMARUÍ', 'Pix', 600.00, '2022-12-08', '2022-12-12'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ANDERSON MEZARI DA SILVA JUNIOR' AND rental_date = '2023-01-15');

-- 5. MARCIO ZEPPELINI - 07/01/2023 (Observações aplicadas a todos os registros dele neste batch)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, status, location, payment_method, value, observations, payment_date_1, payment_date_2)
SELECT 'MARCIO ZEPPELINI', '1199653-7601', '2023-01-07', 'Diária/Meia', 'Concluído', 'LAGUNA', 'Pix', 300.00, 'Horário: VER AGENDA. Dia 28/12, 28/01 e dia 11/02 haver. Substituiu o dia 12/02 pelo dia 09/02.', '2022-12-21', '2023-02-06'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARCIO ZEPPELINI' AND rental_date = '2023-01-07');

-- 6. MARCIO ZEPPELINI - 08/01/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, status, location, payment_method, value, observations, payment_date_1, payment_date_2)
SELECT 'MARCIO ZEPPELINI', '1199653-7601', '2023-01-08', 'Diária/Meia', 'Concluído', 'LAGUNA', 'Pix', 300.00, 'Horário: VER AGENDA. Controle de datas Márcio 17, 28 E 30/12/2022 ---- 7,8,22,28,29/01/2023', '2022-12-21', '2023-02-06'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARCIO ZEPPELINI' AND rental_date = '2023-01-08');

-- 7. MARCIO ZEPPELINI - 22/01/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, status, location, payment_method, value, observations, payment_date_1, payment_date_2)
SELECT 'MARCIO ZEPPELINI', '1199653-7601', '2023-01-22', 'Diária/Meia', 'Concluído', 'LAGUNA', 'Pix', 300.00, 'Horário: VER AGENDA.', '2022-12-21', '2023-02-06'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARCIO ZEPPELINI' AND rental_date = '2023-01-22');

-- 8. MARCIO ZEPPELINI - 28/01/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, status, location, payment_method, value, observations, payment_date_1, payment_date_2)
SELECT 'MARCIO ZEPPELINI', '1199653-7601', '2023-01-28', 'Diária/Meia', 'Concluído', 'LAGUNA', 'Pix', 300.00, 'Horário: VER AGENDA.', '2022-12-21', '2023-02-06'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARCIO ZEPPELINI' AND rental_date = '2023-01-28');

-- 9. MARCIO ZEPPELINI - 29/01/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, status, location, payment_method, value, observations, payment_date_1, payment_date_2)
SELECT 'MARCIO ZEPPELINI', '1199653-7601', '2023-01-29', 'Diária/Meia', 'Concluído', 'LAGUNA', 'Pix', 300.00, 'Horário: VER AGENDA.', '2022-12-21', '2023-02-06'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARCIO ZEPPELINI' AND rental_date = '2023-01-29');

-- 10. MARCIO ZEPPELINI - 09/02/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, status, location, payment_method, value, observations, payment_date_1, payment_date_2)
SELECT 'MARCIO ZEPPELINI', '1199653-7601', '2023-02-09', 'Diária/Meia', 'Concluído', 'LAGUNA', 'Pix', 300.00, 'Horário: VER AGENDA.', '2022-12-21', '2023-02-06'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARCIO ZEPPELINI' AND rental_date = '2023-02-09');

-- 11. MARCIO ZEPPELINI - 11/02/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, status, location, payment_method, value, observations, payment_date_1, payment_date_2)
SELECT 'MARCIO ZEPPELINI', '1199653-7601', '2023-02-11', 'Diária/Meia', 'Concluído', 'LAGUNA', 'Pix', 300.00, 'Horário: VER AGENDA.', '2022-12-21', '2023-02-06'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARCIO ZEPPELINI' AND rental_date = '2023-02-11');

-- 12. MARCIO ZEPPELINI - 12/02/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, status, location, payment_method, value, observations, payment_date_1, payment_date_2)
SELECT 'MARCIO ZEPPELINI', '1199653-7601', '2023-02-12', 'Diária/Meia', 'Concluído', 'LAGUNA', 'Pix', 300.00, 'Horário: VER AGENDA.', '2022-12-21', '2023-02-06'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARCIO ZEPPELINI' AND rental_date = '2023-02-12');

-- 13. MARCIO ZEPPELINI - 25/02/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, status, location, payment_method, value, observations, payment_date_1, payment_date_2)
SELECT 'MARCIO ZEPPELINI', '1199653-7601', '2023-02-25', 'Diária/Meia', 'Concluído', 'LAGUNA', 'Pix', 300.00, 'Horário: VER AGENDA.', '2022-12-21', '2023-02-06'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARCIO ZEPPELINI' AND rental_date = '2023-02-25');

-- 14. MARCIO ZEPPELINI - 26/02/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, status, location, payment_method, value, observations, payment_date_1, payment_date_2)
SELECT 'MARCIO ZEPPELINI', '1199653-7601', '2023-02-26', 'Diária/Meia', 'Concluído', 'LAGUNA', 'Pix', 300.00, 'Horário: VER AGENDA.', '2022-12-21', '2023-02-06'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARCIO ZEPPELINI' AND rental_date = '2023-02-26');

-- 15. GUSTAVO HERDT DUARTE
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'GUSTAVO HERDT DUARTE', '4899184-6896', '2023-01-04', 'Meia Diária', '10:00', '14:00', 'Concluído', 'MARINA TUBARÃO', 'Pix', 350.00, '2023-01-03', '2023-01-03'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'GUSTAVO HERDT DUARTE' AND rental_date = '2023-01-04');

-- 16. REGI NETO
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'REGI NETO', '4899677-5005', '2023-01-05', 'Meia Diária', '14:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 350.00, '2023-01-05', '2023-01-05'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'REGI NETO' AND rental_date = '2023-01-05');

-- 17. ANDERSON FOIZER FLORZINO
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ANDERSON FOIZER FLORZINO', '4899647-9372', '2023-01-06', 'Meia Diária', '14:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 350.00, '2023-01-06', '2023-01-06'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ANDERSON FOIZER FLORZINO' AND rental_date = '2023-01-06');

-- 18. CEDENIR FRANCELINO PEREIRA
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1)
SELECT 'CEDENIR FRANCELINO PEREIRA', '48991790025', '2023-01-12', 'Diária', '10:00', '18:00', 'Concluído', 'IMBITUBA', 'Pix', 600.00, '2023-01-10'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'CEDENIR FRANCELINO PEREIRA' AND rental_date = '2023-01-12');

-- 19. VINICIUS BARRETO - 26/01/2023 (CORRIGIDO)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, observations, payment_date_1, payment_date_2)
SELECT 'VINICIUS BARRETO', '4899985-8799', '2023-01-26', 'Diária', '10:00', '18:00', 'Concluído', 'TUBARÃO', 'Pix', 450.00, 'Foi realizado R$150 em abastecimento, pois usou meia diária apenas', '2022-12-13', '2023-01-15'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'VINICIUS BARRETO' AND rental_date = '2023-01-26');

-- 20. AYRTON
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'AYRTON', '48996418668', '2023-01-28', 'Diária', '10:00', '18:00', 'Concluído', 'TUBARÃO', 'Pix', 600.00, '2023-01-25', '2023-01-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'AYRTON' AND rental_date = '2023-01-28');

-- 21. ADHAN D'QUADRA
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ADHAN D''QUADRA', '48999195342', '2023-03-02', 'Meia Diária', '14:30', 'Concluído', 'LAGUNA', 'Dinheiro', 200.00, '2023-01-26', '2023-03-02'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ADHAN D''QUADRA' AND rental_date = '2023-03-02');

-- 22. ISMAEL - 03/02/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ISMAEL', '48991614699', '2023-02-03', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pix', 600.00, '2023-01-29', '2023-02-05'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ISMAEL' AND rental_date = '2023-02-03');

-- 23. ISMAEL - 04/02/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ISMAEL', '48991614699', '2023-02-04', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pix', 600.00, '2023-01-29', '2023-02-05'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ISMAEL' AND rental_date = '2023-02-04');

-- 24. RODRIGO PIZZOLATTI
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1)
SELECT 'RODRIGO PIZZOLATTI', '4899841320', '2023-02-11', 'Meia Diária', '09:00', '13:00', 'Concluído', 'LAGUNA', 'Pix', 400.00, '2023-02-09'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'RODRIGO PIZZOLATTI' AND rental_date = '2023-02-11');

-- 25. MARCELO CAMPELO JULIANO
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'MARCELO CAMPELO JULIANO', '4899162-1414', '2023-02-25', 'Meia Diária', '13:00', '17:00', 'Concluído', 'LAGUNA', 'Pix', 400.00, '2023-02-25', '2023-02-25'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARCELO CAMPELO JULIANO' AND rental_date = '2023-02-25');

-- 26. JONATHA DA SILVA DE OLIVEIRA
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'JONATHA DA SILVA DE OLIVEIRA', '4899655-3526', '2023-02-26', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 600.00, '2023-02-23', '2023-02-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'JONATHA DA SILVA DE OLIVEIRA' AND rental_date = '2023-02-26');

-- 27. DANIEL GERALDI
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'DANIEL GERALDI', '48984465034', '2023-03-04', 'Meia Diária', '14:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 350.00, '2023-03-04', '2023-03-04'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'DANIEL GERALDI' AND rental_date = '2023-03-04');

-- 28. RODRIGO NEVES CALEGARI
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'RODRIGO NEVES CALEGARI', '51989011741', '2023-03-18', 'Meia Diária', '14:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 400.00, '2023-03-18', '2023-03-18'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'RODRIGO NEVES CALEGARI' AND rental_date = '2023-03-18');

-- 29. NATÁLIA ZOMER RIGHETTO
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'NATÁLIA ZOMER RIGHETTO', '4899152-9799', '2023-03-26', 'Meia Diária', '09:00', '13:00', 'Concluído', 'LAGUNA', 'Pix', 400.00, '2023-03-26', '2023-03-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'NATÁLIA ZOMER RIGHETTO' AND rental_date = '2023-03-26');

-- 30. IURY DE OLIVEIRA MAURICIO
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'IURY DE OLIVEIRA MAURICIO', '48 99811-0165', '2023-06-08', 'Meia Diária', '12:00', '16:00', 'Concluído', 'LAGUNA', 'Pix', 350.00, '2023-03-30', '2023-03-30'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'IURY DE OLIVEIRA MAURICIO' AND rental_date = '2023-06-08');

-- 31. FABRICIO MIGUEL WERNER
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, observations, payment_date_1, payment_date_2)
SELECT 'FABRICIO MIGUEL WERNER', '54 99905-8282', '2023-04-08', 'Meia Diária', '10:00', '14:00', 'Concluído', 'LAGUNA', 'Pix', 400.00, 'NÃO LOCAR MAIS', '2023-04-07', '2023-04-07'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'FABRICIO MIGUEL WERNER' AND rental_date = '2023-04-08');

-- 32. ALEXANDRE CORTE REAL
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ALEXANDRE CORTE REAL', '48 99185-6203', '2023-04-22', 'Meia Diária', '13:00', '17:00', 'Concluído', 'LAGUNA', 'Pix', 400.00, '2023-04-22', '2023-04-22'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ALEXANDRE CORTE REAL' AND rental_date = '2023-04-22');

-- 33. CAIO ROGRIGUES FERNANDES
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'CAIO ROGRIGUES FERNANDES', '48 99685-7080', '2023-04-30', 'Diária', '10:00', '18:00', 'Concluído', 'BALNEÁRIO RINCÃO', 'Pix', 600.00, '2023-04-27', '2023-04-29'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'CAIO ROGRIGUES FERNANDES' AND rental_date = '2023-04-30');

-- 34. MARCOS VENICIOS DE ANDRADE
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'MARCOS VENICIOS DE ANDRADE', '48 99113-0943', '2023-05-01', 'Meia Diária', '14:30', '18:30', 'Concluído', 'LAGUNA', 'Pix', 350.00, '2023-04-29', '2023-05-02'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARCOS VENICIOS DE ANDRADE' AND rental_date = '2023-05-01');

-- 35. ROBERTO PIRES DA SILVA
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ROBERTO PIRES DA SILVA', '48 99906-1750', '2023-05-20', 'Meia Diária', '10:00', '14:00', 'Concluído', 'LAGUNA', 'Pix', 400.00, '2023-05-19', '2023-05-20'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ROBERTO PIRES DA SILVA' AND rental_date = '2023-05-20');

-- 36. DANIEL SARTOR - 04/05/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'DANIEL SARTOR', '48 98827-0004', '2023-05-04', 'Meia Diária', '09:00', '13:00', 'Concluído', 'LAGUNA', 'Pix', 350.00, '2023-05-04', '2023-05-04'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'DANIEL SARTOR' AND rental_date = '2023-05-04');

-- 37. VIKTOR GOMES NOGUEIRA DE SA
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'VIKTOR GOMES NOGUEIRA DE SA', '2196989-0454', '2023-07-16', 'Meia Diária', '09:00', '13:00', 'Concluído', 'LAGUNA', 'Pix', 350.00, '2023-07-10', '2023-07-10'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'VIKTOR GOMES NOGUEIRA DE SA' AND rental_date = '2023-07-16');

-- 38. MARCELO MARZOLA DONOFRIO - 21/07/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'MARCELO MARZOLA DONOFRIO', '48 99822-6030', '2023-07-21', 'Diária/Meia', '08:00', '16:00', 'Concluído', 'TUBARÃO/ARARANGUÁ', 'Pix', 500.00, '2023-07-21', '2023-07-21'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARCELO MARZOLA DONOFRIO' AND rental_date = '2023-07-21');

-- 39. MARCELO MARZOLA DONOFRIO - 22/07/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'MARCELO MARZOLA DONOFRIO', '48 99822-6030', '2023-07-22', 'Diária/Meia', '08:00', '16:00', 'Concluído', 'TUBARÃO/ARARANGUÁ', 'Pix', 500.00, '2023-07-21', '2023-07-21'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARCELO MARZOLA DONOFRIO' AND rental_date = '2023-07-22');

-- 40. DANIEL SARTOR - 06/08/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'DANIEL SARTOR', '48 98827-0004', '2023-08-06', 'Meia Diária', '08:00', '12:00', 'Concluído', 'LAGUNA', 'Pix', 400.00, '2023-08-05', '2023-08-06'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'DANIEL SARTOR' AND rental_date = '2023-08-06');

-- 41. KELCION CORREA DA SILVA
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'KELCION CORREA DA SILVA', '48 99654-1078', '2023-08-27', 'Meia Diária', '14:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 400.00, '2023-08-27', '2023-08-27'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'KELCION CORREA DA SILVA' AND rental_date = '2023-08-27');

-- 42. TIAGO DOS SANTOS FRANCISCO - 16/09/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'TIAGO DOS SANTOS FRANCISCO', '47 99128-3950', '2023-09-16', 'Diária', '10:00', '18:00', 'Concluído', 'BALNEÁRIO RINCÃO', 'Pix', 550.00, '2023-09-15', '2023-09-18'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'TIAGO DOS SANTOS FRANCISCO' AND rental_date = '2023-09-16');

-- 43. TIAGO DOS SANTOS FRANCISCO - 17/09/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'TIAGO DOS SANTOS FRANCISCO', '47 99128-3950', '2023-09-17', 'Diária', '10:00', '18:00', 'Concluído', 'BALNEÁRIO RINCÃO', 'Pix', 550.00, '2023-09-15', '2023-09-18'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'TIAGO DOS SANTOS FRANCISCO' AND rental_date = '2023-09-17');

-- 44. ALEXANDRE FELACO
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ALEXANDRE FELACO', '47999110029', '2023-11-04', 'Meia Diária', '14:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 400.00, '2023-11-04', '2023-11-04'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ALEXANDRE FELACO' AND rental_date = '2023-11-04');

-- 45. ALISSON SILVANO SILVEIRA - 25/11/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ALISSON SILVANO SILVEIRA', '48 99862-4646', '2023-11-25', 'Diária', '10:00', '18:00', 'Concluído', 'GAROPABA', 'Pix', 500.00, '2023-11-22', '2023-11-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ALISSON SILVANO SILVEIRA' AND rental_date = '2023-11-25');

-- 46. ALISSON SILVANO SILVEIRA - 26/11/2023
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ALISSON SILVANO SILVEIRA', '48 99862-4646', '2023-11-26', 'Diária', '10:00', '18:00', 'Concluído', 'GAROPABA', 'Pix', 500.00, '2023-11-22', '2023-11-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ALISSON SILVANO SILVEIRA' AND rental_date = '2023-11-26');

-- 47. THIAGO PEREIRA DA SILVA
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'THIAGO PEREIRA DA SILVA', '48996100742', '2023-11-30', 'Meia Diária', '14:30', '18:30', 'Concluído', 'LAGUNA', 'Pix', 400.00, '2023-11-30', '2023-11-30'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'THIAGO PEREIRA DA SILVA' AND rental_date = '2023-11-30');

-- 48. EDUARDO DE GODOY NAZARIO
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'EDUARDO DE GODOY NAZARIO', '48991365572', '2023-12-02', 'Meia Diária', '14:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 400.00, '2023-11-30', '2023-12-03'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'EDUARDO DE GODOY NAZARIO' AND rental_date = '2023-12-02');

-- 49. VILMARA DOMINGOS BARBOSA
INSERT INTO rentals (client_name, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'VILMARA DOMINGOS BARBOSA', '2023-12-15', 'Diária', '09:00', '17:00', 'Concluído', 'LAGUNA', 'Pix', 600.00, '2023-12-14', '2023-12-14'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'VILMARA DOMINGOS BARBOSA' AND rental_date = '2023-12-15');

-- 50. GILIARDI MACIEL DOS SANTOS
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'GILIARDI MACIEL DOS SANTOS', '48999937299', '2023-12-16', 'Meia Diária', '09:00', '13:00', 'Concluído', 'LAGUNA', 'Pix', 400.00, '2023-12-15', '2023-12-16'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'GILIARDI MACIEL DOS SANTOS' AND rental_date = '2023-12-16');

-- 51. LUCAS DE OLIVEIRA DE FARIAS
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'LUCAS DE OLIVEIRA DE FARIAS', '48999734843', '2023-12-19', 'Meia Diária', '09:00', '13:00', 'Concluído', 'LAGUNA', 'Pix', 400.00, '2023-12-19', '2023-12-20'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'LUCAS DE OLIVEIRA DE FARIAS' AND rental_date = '2023-12-19');

-- 52 a 56. MAICON PATRICIO JEREMIAS (Locações múltiplas em Dezembro)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'MAICON PATRICIO JEREMIAS', '48999840234', '2023-12-21', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pix', 500.00, '2023-12-26', '2023-12-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MAICON PATRICIO JEREMIAS' AND rental_date = '2023-12-21');

INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'MAICON PATRICIO JEREMIAS', '48999840234', '2023-12-22', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pix', 500.00, '2023-12-29', '2023-12-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MAICON PATRICIO JEREMIAS' AND rental_date = '2023-12-22');

INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'MAICON PATRICIO JEREMIAS', '48999840234', '2023-12-23', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pix', 500.00, '2023-12-29', '2023-12-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MAICON PATRICIO JEREMIAS' AND rental_date = '2023-12-23');

INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'MAICON PATRICIO JEREMIAS', '48999840234', '2023-12-24', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pix', 500.00, '2023-12-29', '2023-12-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MAICON PATRICIO JEREMIAS' AND rental_date = '2023-12-24');

INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'MAICON PATRICIO JEREMIAS', '48999840234', '2023-12-25', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pix', 500.00, '2023-12-29', '2023-12-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MAICON PATRICIO JEREMIAS' AND rental_date = '2023-12-25');

-- 57 a 62. ALISSON SILVANO SILVEIRA (Locações múltiplas em Dezembro)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ALISSON SILVANO SILVEIRA', '48 99862-4646', '2023-12-26', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 500.00, '2023-12-08', '2023-12-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ALISSON SILVANO SILVEIRA' AND rental_date = '2023-12-26');

INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ALISSON SILVANO SILVEIRA', '48 99862-4646', '2023-12-27', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 500.00, '2023-12-08', '2023-12-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ALISSON SILVANO SILVEIRA' AND rental_date = '2023-12-27');

INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ALISSON SILVANO SILVEIRA', '48 99862-4646', '2023-12-28', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 500.00, '2023-12-08', '2023-12-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ALISSON SILVANO SILVEIRA' AND rental_date = '2023-12-28');

INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ALISSON SILVANO SILVEIRA', '48 99862-4646', '2023-12-29', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 500.00, '2023-12-08', '2023-12-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ALISSON SILVANO SILVEIRA' AND rental_date = '2023-12-29');

INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ALISSON SILVANO SILVEIRA', '48 99862-4646', '2023-12-30', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 500.00, '2023-12-08', '2023-12-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ALISSON SILVANO SILVEIRA' AND rental_date = '2023-12-30');

INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ALISSON SILVANO SILVEIRA', '48 99862-4646', '2023-12-31', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 500.00, '2023-12-08', '2023-12-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ALISSON SILVANO SILVEIRA' AND rental_date = '2023-12-31');

COMMIT;
