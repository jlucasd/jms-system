
-- IMPORTAÇÃO DE LOCAÇÕES DE 2025
-- Este script insere os dados de 2025, tratando duplicidades e comissões.

BEGIN;

-- 1. LUIZ CARLOS NOBRE NETO
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'LUIZ CARLOS NOBRE NETO', '(48) 996029608', '2025-01-03', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-12-19', '2024-12-19'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'LUIZ CARLOS NOBRE NETO' AND rental_date = '2025-01-03');

-- 2. ANDERSON MEZARI DA SILVA JUNIOR - 04/01
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ANDERSON MEZARI DA SILVA JUNIOR', '48 98823-5596', '2025-01-04', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pix', 750.00, '2025-09-11', '2025-09-11'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ANDERSON MEZARI DA SILVA JUNIOR' AND rental_date = '2025-01-04');

-- 3. ANDERSON MEZARI DA SILVA JUNIOR - 05/01
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ANDERSON MEZARI DA SILVA JUNIOR', '48 98823-5596', '2025-01-05', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pix', 750.00, '2025-09-11', '2025-09-11'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ANDERSON MEZARI DA SILVA JUNIOR' AND rental_date = '2025-01-05');

-- 4. SEBASTIAN E ELTON
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'SEBASTIAN E ELTON', '48999118893', '2025-01-18', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2025-01-06', '2025-01-18'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'SEBASTIAN E ELTON' AND rental_date = '2025-01-18');

-- 5. EDUARDO SOARES RODRIGUES
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'EDUARDO SOARES RODRIGUES', '48999294624', '2025-01-19', 'Diária', '10:00', '18:00', 'Concluído', 'IMBITUBA', 'Pix', 750.00, '2025-01-14', '2025-01-19'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'EDUARDO SOARES RODRIGUES' AND rental_date = '2025-01-19');

-- 6. EMERSON MIGUEL DE OLIVEIRA
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'EMERSON MIGUEL DE OLIVEIRA', '48999221725', '2025-01-24', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2025-01-22', '2025-01-25'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'EMERSON MIGUEL DE OLIVEIRA' AND rental_date = '2025-01-24');

-- 7. MATHEUS MARTINS DE SOUZA
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'MATHEUS MARTINS DE SOUZA', '48999419133', '2025-02-02', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2025-01-31', '2025-02-02'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MATHEUS MARTINS DE SOUZA' AND rental_date = '2025-02-02');

-- 8. EDSON FLORIANO E SILVA
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'EDSON FLORIANO E SILVA', '53999992161', '2025-02-08', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2025-01-29', '2025-02-08'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'EDSON FLORIANO E SILVA' AND rental_date = '2025-02-08');

-- 9. MARCELO ROBASKI
INSERT INTO rentals (client_name, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'MARCELO ROBASKI', '2025-02-09', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2025-01-29', '2025-02-10'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MARCELO ROBASKI' AND rental_date = '2025-02-09');

-- 10. ALLAN FELIPE TOMAZI
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ALLAN FELIPE TOMAZI', '47991925520', '2025-02-11', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2025-02-11', '2025-02-14'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ALLAN FELIPE TOMAZI' AND rental_date = '2025-02-11');

-- 11. RENAN SCHUCH
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'RENAN SCHUCH', '48 99696-7641', '2025-02-15', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2024-11-17', '2024-11-30'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'RENAN SCHUCH' AND rental_date = '2025-02-15');

-- 12. CLAUDIO ROBERTO DA TRINDADE JUNIOR
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'CLAUDIO ROBERTO DA TRINDADE JUNIOR', '48 99927160', '2025-02-23', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2025-02-10', '2025-02-23'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'CLAUDIO ROBERTO DA TRINDADE JUNIOR' AND rental_date = '2025-02-23');

-- 13. LEANDRO FELIPE CARDOSO - 01/03
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'LEANDRO FELIPE CARDOSO', '48 99610-1100', '2025-03-01', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pix', 750.00, '2025-01-22', '2025-03-04'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'LEANDRO FELIPE CARDOSO' AND rental_date = '2025-03-01');

-- 14. LEANDRO FELIPE CARDOSO - 02/03
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'LEANDRO FELIPE CARDOSO', '48 99610-1100', '2025-03-02', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pix', 750.00, '2025-01-22', '2025-03-04'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'LEANDRO FELIPE CARDOSO' AND rental_date = '2025-03-02');

-- 15. LEANDRO FELIPE CARDOSO - 03/03
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'LEANDRO FELIPE CARDOSO', '48 99610-1100', '2025-03-03', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pix', 750.00, '2025-01-22', '2025-03-04'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'LEANDRO FELIPE CARDOSO' AND rental_date = '2025-03-03');

-- 16. EDUARDO MATTEI MARTINS
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'EDUARDO MATTEI MARTINS', '(48) 99936-5153', '2025-03-08', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pix', 750.00, '2025-03-05', '2025-03-05'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'EDUARDO MATTEI MARTINS' AND rental_date = '2025-03-08');

-- 17. JOÃO LUIS JUNIOR
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'JOÃO LUIS JUNIOR', '(48) 99832-2572', '2025-03-22', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA/IMBITUBA', 'Pix', 750.00, '2025-03-21', '2025-03-22'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'JOÃO LUIS JUNIOR' AND rental_date = '2025-03-22');

-- 18. MIGUEL ANGELO RAMOS - 19/04
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'MIGUEL ANGELO RAMOS', '48 98843-3722', '2025-04-19', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2025-03-31', '2025-03-31'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MIGUEL ANGELO RAMOS' AND rental_date = '2025-04-19');

-- 19. MIGUEL ANGELO RAMOS - 20/04
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'MIGUEL ANGELO RAMOS', '48 98843-3722', '2025-04-20', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2025-03-31', '2025-03-31'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MIGUEL ANGELO RAMOS' AND rental_date = '2025-04-20');

-- 20. JACKSON JOELSON FERNANDES
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'JACKSON JOELSON FERNANDES', '(48) 991038819', '2025-04-26', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2025-04-26', '2025-04-29'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'JACKSON JOELSON FERNANDES' AND rental_date = '2025-04-26');

-- 21. MIGUEL ANGELO RAMOS - 03/05
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'MIGUEL ANGELO RAMOS', '48 98843-3722', '2025-05-03', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2025-03-31', '2025-03-31'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MIGUEL ANGELO RAMOS' AND rental_date = '2025-05-03');

-- 22. ALINE EDUVIGES DE OLIVEIRA
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2)
SELECT 'ALINE EDUVIGES DE OLIVEIRA', '48 99928-2526', '2025-05-04', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2025-05-01', '2025-05-04'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ALINE EDUVIGES DE OLIVEIRA' AND rental_date = '2025-05-04');

-- 23. ISABELLE SANTOS - 13/09 (COMISSÃO)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2, commission_check, commission_value)
SELECT 'ISABELLE SANTOS', '(48) 99996354', '2025-09-13', 'Diária', '10:00', '18:00', 'Concluído', 'IMBITUBA', 'Pix', 750.00, '2025-07-14', '2025-09-12', TRUE, 200.00
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ISABELLE SANTOS' AND rental_date = '2025-09-13');

-- 24. RAFAEL FELISBERTO - 04/10 (COMISSÃO)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2, commission_check, commission_value)
SELECT 'RAFAEL FELISBERTO', '48996443684', '2025-10-04', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2025-10-04', '2025-10-04', TRUE, 200.00
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'RAFAEL FELISBERTO' AND rental_date = '2025-10-04');

-- 25. RAFAEL FELISBERTO - 05/10 (COMISSÃO)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2, commission_check, commission_value)
SELECT 'RAFAEL FELISBERTO', '48996443684', '2025-10-05', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 750.00, '2025-10-04', '2025-10-04', TRUE, 200.00
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'RAFAEL FELISBERTO' AND rental_date = '2025-10-05');

-- 26. ISABELLE SANTOS - 18/10 (COMISSÃO)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2, commission_check, commission_value)
SELECT 'ISABELLE SANTOS', '(48) 99996354', '2025-10-18', 'Diária', '10:00', '18:00', 'Concluído', 'IMBITUBA', 'Pix', 750.00, '2025-09-24', '2025-10-18', TRUE, 200.00
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ISABELLE SANTOS' AND rental_date = '2025-10-18');

-- 27. LUIZ FERNANDO BITENCOURT (COMISSÃO)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2, commission_check, commission_value)
SELECT 'LUIZ FERNANDO BITENCOURT', '(48) 991560909', '2025-10-25', 'Diária', '10:00', '18:00', 'Concluído', 'ARARANGUÁ', 'Pix', 800.00, '2025-10-10', '2025-10-27', TRUE, 200.00
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'LUIZ FERNANDO BITENCOURT' AND rental_date = '2025-10-25');

-- 28. ATILIO HECTOR GOULART DE JESUS (COMISSÃO)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2, commission_check, commission_value)
SELECT 'ATILIO HECTOR GOULART DE JESUS', '(48) 992123348', '2025-11-01', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 800.00, '2025-10-17', '2025-11-01', TRUE, 200.00
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ATILIO HECTOR GOULART DE JESUS' AND rental_date = '2025-11-01');

-- 29. SAMUEL BAJAQUE (COMISSÃO)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, payment_date_2, commission_check, commission_value)
SELECT 'SAMUEL BAJAQUE', '(48) 996080941', '2025-11-02', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 800.00, '2025-11-01', '2025-11-05', TRUE, 200.00
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'SAMUEL BAJAQUE' AND rental_date = '2025-11-02');

-- 30. JONATAN FAGUNDES (COMISSÃO + OBS)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, commission_check, commission_value, observations)
SELECT 'JONATAN FAGUNDES', '4899150-2150', '2025-12-06', 'Diária', '10:00', '18:00', 'Concluído', 'BALNEÁRIO RINCÃO', 'Pix', 800.00, '2025-12-03', TRUE, 200.00, 'FECHADO POR MANOEL'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'JONATAN FAGUNDES' AND rental_date = '2025-12-06');

-- 31. BRENO CARVALHO KUHN (COMISSÃO + OBS)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, commission_check, commission_value, observations)
SELECT 'BRENO CARVALHO KUHN', '48 99601-6071', '2025-12-07', 'Diária', '10:00', '18:00', 'Concluído', 'IMBITUBA', 'Pix', 800.00, '2025-11-19', TRUE, 200.00, 'FECHADO POR MANOEL'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'BRENO CARVALHO KUHN' AND rental_date = '2025-12-07');

-- 32. LEANDRO QUERINO (COMISSÃO + OBS)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, commission_check, commission_value, observations)
SELECT 'LEANDRO QUERINO', '4899209-0015', '2025-12-14', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA / IMBITUBA', 'Pix', 800.00, '2025-12-09', TRUE, 200.00, 'FECHADO POR MANOEL'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'LEANDRO QUERINO' AND rental_date = '2025-12-14');

-- 33. GUSTAVO DE OLIVEIRA FELIPPE (COMISSÃO)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, commission_check, commission_value)
SELECT 'GUSTAVO DE OLIVEIRA FELIPPE', '48996465796', '2025-12-18', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 800.00, '2025-12-18', TRUE, 200.00
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'GUSTAVO DE OLIVEIRA FELIPPE' AND rental_date = '2025-12-18');

-- 34. EDUARDO SOARES RODRIGUES (COMISSÃO)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, commission_check, commission_value)
SELECT 'EDUARDO SOARES RODRIGUES', '4899929-4624', '2025-12-26', 'Diária', '10:00', '18:00', 'Concluído', 'GUAIÚBA', 'Pix', 800.00, '2025-12-22', TRUE, 200.00
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'EDUARDO SOARES RODRIGUES' AND rental_date = '2025-12-26');

-- 35. JHONATAN GRANATER (COMISSÃO + OBS)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, commission_check, commission_value, observations)
SELECT 'JHONATAN GRANATER', '4799651-5673', '2025-12-28', 'Diária', '10:00', '18:00', 'Concluído', 'PERRIXIL / CAPUTERA', 'Pix', 800.00, '2025-12-08', TRUE, 200.00, 'FECHADO POR MANOEL'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'JHONATAN GRANATER' AND rental_date = '2025-12-28');

-- 36. ALEXANDRE FELIPE (COMISSÃO)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, commission_check, commission_value)
SELECT 'ALEXANDRE FELIPE', '47 991874560', '2025-12-30', 'Diária', '10:00', '18:00', 'Concluído', 'LAGUNA', 'Pix', 800.00, '2025-11-27', TRUE, 200.00
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'ALEXANDRE FELIPE' AND rental_date = '2025-12-30');

-- 37. MURILO SOARES MENDES - 30/12 (COMISSÃO + OBS)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, commission_check, commission_value, observations)
SELECT 'MURILO SOARES MENDES', '4899918-9576', '2025-12-30', 'Diária', '10:00', '18:00', 'Concluído', 'JAGUARUNA / ESTEVES', 'Pix', 800.00, '2025-12-17', TRUE, 200.00, 'FECHADO POR MANOEL'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MURILO SOARES MENDES' AND rental_date = '2025-12-30');

-- 38. MURILO SOARES MENDES - 31/12 (COMISSÃO + OBS)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, commission_check, commission_value, observations)
SELECT 'MURILO SOARES MENDES', '4899918-9576', '2025-12-31', 'Diária', '10:00', '18:00', 'Concluído', 'JAGUARUNA / ESTEVES', 'Pix', 800.00, '2025-12-17', TRUE, 200.00, 'FECHADO POR MANOEL'
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'MURILO SOARES MENDES' AND rental_date = '2025-12-31');

-- 39. JAIR DA SILVA MACHADO NETO (COMISSÃO)
INSERT INTO rentals (client_name, client_phone, rental_date, rental_type, start_time, end_time, status, location, payment_method, value, payment_date_1, commission_check, commission_value)
SELECT 'JAIR DA SILVA MACHADO NETO', '47 99998-6804', '2025-12-27', 'Diária', '10:00', '18:00', 'Pix', 'LAGUNA', 'Pix', 800.00, '2025-12-26', TRUE, 200.00
WHERE NOT EXISTS (SELECT 1 FROM rentals WHERE client_name = 'JAIR DA SILVA MACHADO NETO' AND rental_date = '2025-12-27');

COMMIT;
