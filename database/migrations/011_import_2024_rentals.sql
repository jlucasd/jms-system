
-- IMPORTAÇÃO DE LOCAÇÕES DE 2024
-- Este script insere os dados históricos apenas se não existirem (com base em Cliente + Data).

BEGIN;

-- 1. ALISSON SILVANO SILVEIRA - 01/01/2024 (Da segunda imagem, mas cronologicamente primeiro)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ALISSON SILVANO SILVEIRA', '48 99862-4646', '2024-01-01', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 500.00, '2023-12-08', '2023-12-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ALISSON SILVANO SILVEIRA' AND rental_date = '2024-01-01');

-- 2. MATHEUS DA ROSA CARVALHO
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1)
SELECT 'MATHEUS DA ROSA CARVALHO', '48 99671-5874', '2024-01-04', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 300.00, '2023-12-12'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MATHEUS DA ROSA CARVALHO' AND rental_date = '2024-01-04');

-- 3. VINICIUS BARRETO - 06/01/2024
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1)
SELECT 'VINICIUS BARRETO', '48 99985-8799', '2024-01-06', 'Diária', '10:00', '18:00', 'Concluído', 'BALNEÁRIO RINCÃO', 'Pix', 500.00, '2023-11-17'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'VINICIUS BARRETO' AND rental_date = '2024-01-06');

-- 4. VINICIUS BARRETO - 07/01/2024
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1)
SELECT 'VINICIUS BARRETO', '48 99985-8799', '2024-01-07', 'Diária', '10:00', '18:00', 'Concluído', 'BALNEÁRIO RINCÃO', 'Pix', 500.00, '2023-11-17'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'VINICIUS BARRETO' AND rental_date = '2024-01-07');

-- 5. DOUGLAS MORAES ORTIZ - 08/01/2024
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'DOUGLAS MORAES ORTIZ', '48 99179-4535', '2024-01-08', 'Diária', '10:00', '18:00', 'Concluído', 'BALNEÁRIO RINCÃO', 'Pix', 600.00, '2023-12-22', '2023-12-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'DOUGLAS MORAES ORTIZ' AND rental_date = '2024-01-08');

-- 6. DOUGLAS MORAES ORTIZ - 09/01/2024
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'DOUGLAS MORAES ORTIZ', '48 99179-4535', '2024-01-09', 'Diária', '10:00', '18:00', 'Concluído', 'BALNEÁRIO RINCÃO', 'Pix', 600.00, '2023-12-22', '2023-12-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'DOUGLAS MORAES ORTIZ' AND rental_date = '2024-01-09');

-- 7. MARCIO ZEPPELINI - 12/01/2024
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2, observations)
SELECT 'MARCIO ZEPPELINI', '11 99653-7601', '2024-01-12', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 600.00, '2024-01-19', '2024-01-19', 'Dia 28/12, 28/01 e dia 11/02 haver. Substituiu o dia 12/02 pelo dia 09/02. Tem 5,5 diárias a ver'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARCIO ZEPPELINI' AND rental_date = '2024-01-12');

-- 8. RENAN SCHUCH - 03/02/2024
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'RENAN SCHUCH', '48 99696-7641', '2024-02-03', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pix', 750.00, '2024-02-03', '2024-02-05'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'RENAN SCHUCH' AND rental_date = '2024-02-03');

-- 9. RENAN SCHUCH - 04/02/2024
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'RENAN SCHUCH', '48 99696-7641', '2024-02-04', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pix', 750.00, '2024-02-03', '2024-02-05'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'RENAN SCHUCH' AND rental_date = '2024-02-04');

-- 10. FELIPE VOLPATO SANDRINI
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1)
SELECT 'FELIPE VOLPATO SANDRINI', '48 99646-9578', '2024-02-10', 'Diária', '10:00', '18:00', 'Concluído', 'GAROPABA', 'Pix', 750.00, '2024-02-09'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'FELIPE VOLPATO SANDRINI' AND rental_date = '2024-02-10');

-- 11. EDUARDO MATOS PALMA
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'EDUARDO MATOS PALMA', '48 99172-6273', '2024-02-12', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-02-08', '2024-02-12'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'EDUARDO MATOS PALMA' AND rental_date = '2024-02-12');

-- 12. LEANDRO LUIZ DA ROCHA
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'LEANDRO LUIZ DA ROCHA', '48 99693-0872', '2024-02-14', 'Diária', '10:00', '18:00', 'Concluído', 'JAGUARUNA', 'Pix', 750.00, '2024-02-03', '2024-02-03'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'LEANDRO LUIZ DA ROCHA' AND rental_date = '2024-02-14');

-- 13. ANDERSON ANDRÉ PRETO
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ANDERSON ANDRÉ PRETO', '51 99971-5598', '2024-02-16', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-02-15', '2024-02-16'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ANDERSON ANDRÉ PRETO' AND rental_date = '2024-02-16');

-- 14. ALISSON SILVANO SILVEIRA - 02/03/2024
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ALISSON SILVANO SILVEIRA', '48 99862-4646', '2024-03-02', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 500.00, '2024-03-02', '2024-03-02'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ALISSON SILVANO SILVEIRA' AND rental_date = '2024-03-02');

-- 15. ALISSON SILVANO SILVEIRA - 03/03/2024
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ALISSON SILVANO SILVEIRA', '48 99862-4646', '2024-03-03', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 500.00, '2024-03-02', '2024-03-03'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ALISSON SILVANO SILVEIRA' AND rental_date = '2024-03-03');

-- 16. CLAYTON BENTO COLOMBO
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'CLAYTON BENTO COLOMBO', '48 99842-6299', '2024-03-11', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-03-08', '2024-03-11'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'CLAYTON BENTO COLOMBO' AND rental_date = '2024-03-11');

-- 17. LUCAS ROMAGNA RINALDI
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2, observations)
SELECT 'LUCAS ROMAGNA RINALDI', '', '2024-03-16', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 700.00, '2024-03-16', '2024-03-18', 'Falta pagar a metade'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'LUCAS ROMAGNA RINALDI' AND rental_date = '2024-03-16');

-- 18. KELLER EXTERCOETTER - 23/03/2024
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'KELLER EXTERCOETTER', '48 99181-3363', '2024-03-23', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-03-19', '2024-03-23'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'KELLER EXTERCOETTER' AND rental_date = '2024-03-23');

-- 19. KELCION CORREA DA SILVA
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'KELCION CORREA DA SILVA', '48 99654-1078', '2024-03-31', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-03-30', '2024-03-31'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'KELCION CORREA DA SILVA' AND rental_date = '2024-03-31');

-- 20. ODILON JUNIOR ALMEIDA
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1)
SELECT 'ODILON JUNIOR ALMEIDA', '48 99676-9494', '2024-06-22', 'Meia Diária', '10:00', '13:00', 'Concluído', 'LAGUNA', 'Pix', 500.00, '2024-06-22'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ODILON JUNIOR ALMEIDA' AND rental_date = '2024-06-22');

-- 21. JACKSON JOELSON FERNANDES
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'JACKSON JOELSON FERNANDES', '48 99103-8819', '2024-08-31', 'Meia Diária', '10:00', '13:00', 'Concluído', 'LAGUNA', 'Pix', 500.00, '2024-08-26', '2024-08-31'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'JACKSON JOELSON FERNANDES' AND rental_date = '2024-08-31');

-- 22. VINICIUS DA SILVA - 14/09/2024
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'VINICIUS DA SILVA', '48 99830-6987', '2024-09-14', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-09-14', '2024-09-14'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'VINICIUS DA SILVA' AND rental_date = '2024-09-14');

-- 23. VINICIUS DA SILVA - 06/10/2024
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'VINICIUS DA SILVA', '48 998306987', '2024-10-06', 'Meia Diária', '10:00', '13:00', 'Concluído', 'LAGUNA', 'Pix', 500.00, '2024-10-06', '2024-10-06'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'VINICIUS DA SILVA' AND rental_date = '2024-10-06');

-- 24. THIAGO PEREIRA DA SILVA
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2, observations)
SELECT 'THIAGO PEREIRA DA SILVA', '48 99610-0742', '2024-10-06', 'Meia Diária', '13:00', '18:00', 'Concluído', 'IMBITUBA', 'Pix', 500.00, '2024-10-06', '2024-10-06', 'Praia da Vila'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'THIAGO PEREIRA DA SILVA' AND rental_date = '2024-10-06');

-- 25. DANIEL SARTOR
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'DANIEL SARTOR', '48 98827-0004', '2024-11-02', 'Meia Diária', '13:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 500.00, '2024-11-01', '2024-11-02'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'DANIEL SARTOR' AND rental_date = '2024-11-02');

-- 26. LEANDRO DE SOUZA QUIRINO
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2, observations)
SELECT 'LEANDRO DE SOUZA QUIRINO', '48 992090015', '2024-11-08', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-11-08', '2024-11-08', 'Pagamento: PIX e DINHEIRO'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'LEANDRO DE SOUZA QUIRINO' AND rental_date = '2024-11-08');

-- 27. GILIARDI VIEIRA MARTINS
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'GILIARDI VIEIRA MARTINS', '48 999937299', '2024-11-15', 'Meia Diária', '10:00', '13:00', 'Concluído', 'LAGUNA', 'Pix', 500.00, '2024-11-14', '2024-11-15'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'GILIARDI VIEIRA MARTINS' AND rental_date = '2024-11-15');

-- 28. CLEITON JUNIOR MAFEI
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'CLEITON JUNIOR MAFEI', '3295780484', '2024-11-22', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-11-22', '2024-11-23'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'CLEITON JUNIOR MAFEI' AND rental_date = '2024-11-22');

-- 29. MATHEUS DE AGUIAR
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'MATHEUS DE AGUIAR', '(48) 999762185', '2024-12-21', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-12-09', '2024-12-21'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MATHEUS DE AGUIAR' AND rental_date = '2024-12-21');

-- 30. MARLON MENDES MACHADO
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'MARLON MENDES MACHADO', '(48) 999764335', '2024-12-24', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-12-10', '2024-12-24'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARLON MENDES MACHADO' AND rental_date = '2024-12-24');

-- 31. CLÁUDIO ROBERTO DA TRINDADE JUNIOR
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'CLÁUDIO ROBERTO DA TRINDADE JUNIOR', '48999327160', '2024-12-26', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-12-15', '2024-12-26'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'CLÁUDIO ROBERTO DA TRINDADE JUNIOR' AND rental_date = '2024-12-26');

-- 32. MARCIO ZEPPELINI - 27/12/2024
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'MARCIO ZEPPELINI', '1199653-7601', '2024-12-27', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 700.00, '2024-12-28', '2025-12-28'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARCIO ZEPPELINI' AND rental_date = '2024-12-27');

-- 33. ALESSANDRA CARDONA FIGINI
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ALESSANDRA CARDONA FIGINI', '(48) 991008055', '2024-12-27', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-12-12', '2024-12-27'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ALESSANDRA CARDONA FIGINI' AND rental_date = '2024-12-27');

-- 34. KELLER EXTERCOETTER - 28/12/2024
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'KELLER EXTERCOETTER', '48 99181-3363', '2024-12-28', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-12-02', '2024-12-28'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'KELLER EXTERCOETTER' AND rental_date = '2024-12-28');

-- 35. LUCAS KRAFCHINSKI - 29/12/2024
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'LUCAS KRAFCHINSKI', '(51) 993743024', '2024-12-29', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-12-16', '2025-01-01'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'LUCAS KRAFCHINSKI' AND rental_date = '2024-12-29');

-- 36. LUCAS KRAFCHINSKI - 30/12/2024
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'LUCAS KRAFCHINSKI', '(51) 993743024', '2024-12-30', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-12-16', '2025-01-01'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'LUCAS KRAFCHINSKI' AND rental_date = '2024-12-30');

-- 37. LUCAS KRAFCHINSKI - 31/12/2024
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'LUCAS KRAFCHINSKI', '(51) 993743024', '2024-12-31', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-12-16', '2025-01-01'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'LUCAS KRAFCHINSKI' AND rental_date = '2024-12-31');

COMMIT;
