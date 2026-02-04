
-- SCRIPT DE RESTAURAÇÃO DE DADOS (BASEADO NOS DADOS DE EXEMPLO DO SISTEMA)
-- Copie e cole este conteúdo no SQL Editor do Supabase para restaurar essas linhas.

BEGIN;

INSERT INTO rentals (client_name, client_cpf, client_phone, rental_date, rental_type, start_time, end_time, status, location, observations, payment_method, value) VALUES
('João da Silva', '123.456.789-00', '(11) 98765-4321', '2023-12-01', 'Meia Diária', '09:00', '13:00', 'Concluído', 'Marina Azul', 'Cliente primeira viagem', 'Pix', 600.00),
('Maria Oliveira', '234.567.890-11', '(21) 91234-5678', '2023-12-02', 'Diária', '09:00', '17:00', 'Concluído', 'Praia do Forte', 'Colete extra G', 'Cartão', 1200.00),
('Carlos Pereira', '345.678.901-22', '(31) 99876-5432', '2023-12-05', 'Meia Diária', '13:00', '17:00', 'Confirmado', 'Marina Azul', '', 'Dinheiro', 600.00),
('Ana Costa', '456.789.012-33', '(41) 98765-1234', '2023-12-10', 'Diária', '08:00', '16:00', 'Concluído', 'Lagoa dos Patos', 'Instrutor solicitado', 'Pix', 1300.00),
('Pedro Santos', '567.890.123-44', '(51) 91234-8765', '2023-12-15', 'Meia Diária', '09:00', '13:00', 'Pendente', 'Marina Azul', '', 'Cartão', 600.00),
('Fernanda Lima', '678.901.234-55', '(61) 99876-1234', '2023-12-20', 'Diária', '09:00', '17:00', 'Confirmado', 'Praia do Forte', 'Cliente VIP', 'Pix', 1100.00);

COMMIT;
