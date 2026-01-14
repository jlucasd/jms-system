
import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import SignUpScreen from './components/SignUpScreen';
import DashboardScreen from './components/DashboardScreen';

type Page = 'login' | 'forgotPassword' | 'signUp';
export type DashboardPage = 'dashboard' | 'financialDashboard' | 'users' | 'rentals' | 'clients' | 'financial' | 'settings';
export type User = { 
  email: string; 
  password?: string;
  fullName?: string;
  role?: string;
  imageUrl?: string | null;
};

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Ativo' | 'Inativo';
  imageUrl: string | null;
};

export type RentalStatus = 'Pendente' | 'Confirmado' | 'Concluído';
export type RentalType = 'Meia Diária' | 'Diária';

export interface Rental {
    id: number;
    clientName: string;
    clientCpf: string;
    clientInitial: string;
    clientPhone: string;
    date: string;
    rentalType: RentalType;
    startTime: string;
    endTime: string;
    status: RentalStatus;
    location: string;
    observations?: string;
    paymentMethod?: 'Pix' | 'Cartão' | 'Dinheiro';
}

export interface Cost {
    id: number;
    type: string;
    value: number;
    paidValue: number;
    investor: string;
    date: string; // YYYY-MM-DD or empty string
    isPaid: boolean;
    observations?: string;
}

const initialCosts: Cost[] = [
  { id: 1, type: "Bola de reboque", value: 450.00, paidValue: 450.00, investor: "Grupo", date: "2022-12-22", isPaid: true, observations: "" },
  { id: 2, type: "Rolamento / Cubo + Conserto Paralama", value: 730.00, paidValue: 730.00, investor: "João", date: "2022-12-23", isPaid: true, observations: "" },
  { id: 3, type: "3 Coletes Salva-Vidas", value: 849.00, paidValue: 849.00, investor: "Mayck", date: "2022-12-23", isPaid: true, observations: "" },
  { id: 4, type: "Revisão Jet Ski", value: 1800.00, paidValue: 1800.00, investor: "Grupo", date: "2022-12-29", isPaid: true, observations: "3x (quitado) última parcela de R$284" },
  { id: 5, type: "2 Bicos adocares", value: 50.00, paidValue: 50.00, investor: "Grupo", date: "2023-01-09", isPaid: true, observations: "" },
  { id: 6, type: "Mosquetão / Cabo de atracar traseiro", value: 9.90, paidValue: 9.90, investor: "Grupo", date: "2023-01-10", isPaid: true, observations: "" },
  { id: 7, type: "Capa impermeável para documento", value: 0.00, paidValue: 0.00, investor: "Mayck", date: "2023-01-15", isPaid: true, observations: "" },
  { id: 8, type: "Âncora", value: 285.00, paidValue: 285.00, investor: "Grupo", date: "2023-01-15", isPaid: true, observations: "R$85 o Mayck assumiu como investimento" },
  { id: 9, type: "1 litro - Óleo Yamaha", value: 42.00, paidValue: 42.00, investor: "Grupo", date: "2023-01-18", isPaid: true, observations: "" },
  { id: 10, type: "Taxa transferência Jet Ski", value: 44.00, paidValue: 44.00, investor: "Grupo", date: "2023-01-18", isPaid: true, observations: "" },
  { id: 11, type: "Estofamento Banco", value: 80.00, paidValue: 80.00, investor: "Grupo", date: "2023-01-19", isPaid: true, observations: "" },
  { id: 12, type: "Reparo carenagem", value: 300.00, paidValue: 300.00, investor: "Grupo", date: "2023-01-26", isPaid: true, observations: "" },
  { id: 13, type: "4 litros - Óleo Yamaha", value: 168.00, paidValue: 168.00, investor: "Grupo", date: "2023-02-06", isPaid: true, observations: "" },
  { id: 14, type: "2 Presilhas", value: 11.54, paidValue: 11.54, investor: "Grupo", date: "2023-02-07", isPaid: true, observations: "" },
  { id: 15, type: "2 mosquetões", value: 18.00, paidValue: 18.00, investor: "Grupo", date: "2023-02-15", isPaid: true, observations: "" },
  { id: 16, type: "Kit limpeza", value: 77.55, paidValue: 77.55, investor: "Grupo", date: "2023-03-13", isPaid: true, observations: "" },
  { id: 17, type: "Cadeado", value: 23.00, paidValue: 23.00, investor: "Grupo", date: "2023-04-05", isPaid: true, observations: "" },
  { id: 18, type: "2 esticadores", value: 0.00, paidValue: 0.00, investor: "Mayck", date: "2023-04-20", isPaid: true, observations: "" },
  { id: 19, type: "2 litros - Óleo Yamaha", value: 84.00, paidValue: 84.00, investor: "Grupo", date: "2023-04-22", isPaid: true, observations: "" },
  { id: 20, type: "2 litros - Óleo Yamaha", value: 84.00, paidValue: 84.00, investor: "Grupo", date: "2023-07-21", isPaid: true, observations: "R$84 o Mayck assumiu como investimento" },
  { id: 21, type: "1 litro - Óleo Yamaha", value: 42.00, paidValue: 42.00, investor: "Grupo", date: "2023-11-20", isPaid: true, observations: "R$42 o Mayck assumiu como investimento" },
  { id: 22, type: "Conserto/Costura banco", value: 150.00, paidValue: 150.00, investor: "João", date: "2024-01-19", isPaid: true, observations: "" },
  { id: 23, type: "Bola de Reboque", value: 450.00, paidValue: 450.00, investor: "Stivison", date: "2024-01-19", isPaid: true, observations: "" },
  { id: 24, type: "2 litros - Óleo Yamaha", value: 107.00, paidValue: 107.00, investor: "Grupo", date: "2024-02-12", isPaid: true, observations: "" },
  { id: 25, type: "Biqueira Jet", value: 415.00, paidValue: 415.00, investor: "Grupo", date: "2024-02-23", isPaid: true, observations: "" },
  { id: 26, type: "Parcela do mês de setembro", value: 643.28, paidValue: 643.28, investor: "João", date: "2024-02-28", isPaid: true, observations: "R$343,28 devolvido para o João" },
  { id: 27, type: "Parcela do mês de setembro", value: 300.00, paidValue: 300.00, investor: "Stivison", date: "2024-02-28", isPaid: true, observations: "" },
  { id: 28, type: "Parcela do mês de setembro", value: 396.10, paidValue: 396.10, investor: "Mayck", date: "2024-02-28", isPaid: true, observations: "R$ 96,10 devolvido para o Mayck" },
  { id: 29, type: "Parcela do mês de outubro", value: 351.23, paidValue: 351.23, investor: "João", date: "2024-02-28", isPaid: true, observations: "R$ 51,23 devolvido para o João" },
  { id: 30, type: "Parcela do mês de outubro", value: 300.00, paidValue: 300.00, investor: "Stivison", date: "2024-02-28", isPaid: true, observations: "" },
  { id: 31, type: "Parcela do mês de outubro", value: 395.50, paidValue: 395.50, investor: "Mayck", date: "2024-02-28", isPaid: true, observations: "R$ 95,50 devolvido para o Mayck" },
  { id: 32, type: "Parcela do mês de novembro", value: 496.46, paidValue: 496.46, investor: "João", date: "2024-02-28", isPaid: true, observations: "" },
  { id: 33, type: "Parcela do mês de novembro", value: 496.46, paidValue: 496.46, investor: "Stivison", date: "2024-02-28", isPaid: true, observations: "" },
  { id: 34, type: "Parcela do mês de novembro", value: 496.46, paidValue: 496.46, investor: "Mayck", date: "2024-02-28", isPaid: true, observations: "" },
  { id: 35, type: "8 litros Oleo Jet", value: 357.28, paidValue: 357.28, investor: "Stivison", date: "2024-03-13", isPaid: true, observations: "" },
  { id: 36, type: "Produtos de limpeza jet (cera e lava auto)", value: 36.00, paidValue: 36.00, investor: "Stivison", date: "2024-03-24", isPaid: true, observations: "" },
  { id: 37, type: "Dominio Site", value: 240.00, paidValue: 240.00, investor: "João", date: "2024-04-22", isPaid: true, observations: "" },
  { id: 38, type: "Rastreador Bateria", value: 52.15, paidValue: 52.15, investor: "João", date: "2024-06-17", isPaid: true, observations: "" },
  { id: 39, type: "Seguro", value: 23.86, paidValue: 23.86, investor: "João", date: "2024-07-15", isPaid: true, observations: "" },
  { id: 40, type: "Catraca", value: 50.00, paidValue: 50.00, investor: "Mayck", date: "2024-07-15", isPaid: true, observations: "" },
  { id: 41, type: "Bateria", value: 0, paidValue: 0, investor: "Mayck", date: "2024-07-15", isPaid: true, observations: "" },
  { id: 42, type: "Rastreador Julho", value: 52.15, paidValue: 52.15, investor: "João", date: "2024-07-22", isPaid: true, observations: "" },
  { id: 43, type: "Rastreador Agosto", value: 52.15, paidValue: 52.15, investor: "Stivison", date: "2024-08-06", isPaid: true, observations: "" },
  { id: 44, type: "Rastreador Setembro", value: 52.15, paidValue: 52.15, investor: "João", date: "2024-09-06", isPaid: true, observations: "" },
  { id: 45, type: "Material de Construção - Garagem", value: 3114.66, paidValue: 2076.44, investor: "Grupo", date: "2025-09-09", isPaid: false, observations: "6x R$ 519,11 - Pago 4x" },
  { id: 46, type: "Gasolina - locação", value: 130.84, paidValue: 130.84, investor: "Grupo", date: "2025-09-12", isPaid: true, observations: "" },
  { id: 47, type: "Seguro obrigatório", value: 22.30, paidValue: 22.30, investor: "Grupo", date: "2025-09-12", isPaid: true, observations: "" },
  { id: 48, type: "Mosquetão, tiner e corrente nova", value: 79.85, paidValue: 79.85, investor: "Grupo", date: "2025-09-15", isPaid: true, observations: "" },
  { id: 49, type: "Mão de obra - Garagem", value: 500.00, paidValue: 500.00, investor: "Grupo", date: "2025-09-20", isPaid: true, observations: "Mailson e Maycon" },
  { id: 50, type: "Multa de trânsito", value: 103.14, paidValue: 103.14, investor: "Grupo", date: "2025-10-01", isPaid: true, observations: "" },
  { id: 51, type: "Material para colar a tampa do jet", value: 186.00, paidValue: 186.00, investor: "Ramon", date: "2025-10-28", isPaid: true, observations: "" },
  { id: 52, type: "Cabo Jet", value: 799.00, paidValue: 200.00, investor: "Grupo", date: "2025-11-04", isPaid: false, observations: "4x R$ 200 - Pago 1x" },
  { id: 53, type: "Cabo Jet - Mão de obra", value: 200.00, paidValue: 200.00, investor: "Grupo", date: "2025-11-04", isPaid: true, observations: "" },
  { id: 54, type: "Cubo de roda - Carretinha", value: 235.00, paidValue: 235.00, investor: "Grupo", date: "2025-11-04", isPaid: true, observations: "" },
  { id: 55, type: "Capa jet", value: 300.00, paidValue: 300.00, investor: "Grupo", date: "2025-11-06", isPaid: true, observations: "" },
  { id: 56, type: "Mosquetão - inox", value: 59.90, paidValue: 59.90, investor: "Ramon", date: "2025-11-06", isPaid: true, observations: "" },
  { id: 57, type: "Capa jet", value: 300.00, paidValue: 300.00, investor: "Mayck", date: "2025-11-10", isPaid: true, observations: "" },
  { id: 58, type: "Tinta - retoques", value: 30.00, paidValue: 30.00, investor: "Ramon", date: "2025-11-11", isPaid: true, observations: "" },
  { id: 59, type: "Tinta para o Jet", value: 30.00, paidValue: 30.00, investor: "Grupo", date: "2025-11-12", isPaid: true, observations: "" },
  { id: 60, type: "Teste Jet", value: 38.56, paidValue: 38.56, investor: "Stivison", date: "2025-12-04", isPaid: true, observations: "" },
  { id: 61, type: "Carreta nova", value: 5473.75, paidValue: 1447.38, investor: "Grupo", date: "2025-12-08", isPaid: false, observations: "10x - R$ 447,38" },
  { id: 62, type: "Documento - Carreta nova", value: 195.00, paidValue: 195.00, investor: "Grupo", date: "2025-12-10", isPaid: true, observations: "" },
  { id: 63, type: "Placa - Carreta nova", value: 80.00, paidValue: 80.00, investor: "Grupo", date: "2025-12-12", isPaid: true, observations: "" },
  { id: 64, type: "Graxa - Carreta nova", value: 43.20, paidValue: 43.20, investor: "Stivison", date: "2025-12-12", isPaid: true, observations: "" },
  { id: 65, type: "Bueiras - Amantes da Nautica", value: 17.90, paidValue: 17.90, investor: "Grupo", date: "2025-12-15", isPaid: true, observations: "" },
  { id: 66, type: "Cinta", value: 50.00, paidValue: 50.00, investor: "Ramon", date: "2025-12-20", isPaid: true, observations: "" },
  { id: 67, type: "Cola", value: 18.00, paidValue: 18.00, investor: "Ramon", date: "2025-12-22", isPaid: true, observations: "" },
  { id: 68, type: "Videos/Marketing", value: 0.00, paidValue: 0.00, investor: "Grupo", date: "", isPaid: true, observations: "" },
  { id: 69, type: "Conserto Jet", value: 538.00, paidValue: 538.00, investor: "Mayck", date: "", isPaid: true, observations: "5x (quitado)" },
  { id: 70, type: "Adesivos jet", value: 182.10, paidValue: 182.10, investor: "Stivison", date: "", isPaid: true, observations: "3x (quitado)" },
  { id: 71, type: "8 litros Oleo jet", value: 223.35, paidValue: 223.35, investor: "João", date: "", isPaid: true, observations: "2x (quitado)" },
  { id: 72, type: "Sinaleira", value: 58.05, paidValue: 58.05, investor: "Stivison", date: "", isPaid: true, observations: "2x (quitado)" },
  { id: 73, type: "Translado Jet para Araranguá - Cascata", value: 300.00, paidValue: 300.00, investor: "Grupo", date: "2026-01-08", isPaid: true, observations: "" },
  { id: 74, type: "Costura coletes", value: 30.00, paidValue: 30.00, investor: "Ramon", date: "2026-01-08", isPaid: true, observations: "" },
  { id: 75, type: "Entrada", value: 3000, paidValue: 3000, investor: "Stivison", date: "2022-12-08", isPaid: true, observations: "" },
  { id: 76, type: "Entrada", value: 16500, paidValue: 16500, investor: "João", date: "2022-12-08", isPaid: true, observations: "" },
  { id: 77, type: "Parcela 1 - Empréstimo", value: 1643.28, paidValue: 1614.26, investor: "João", date: "2022-12-22", isPaid: true, observations: "" },
  { id: 78, type: "Rastreador", value: 396.09, paidValue: 387.48, investor: "Mayck", date: "2022-12-22", isPaid: true, observations: "" },
  { id: 79, type: "Rastreador", value: 49.9, paidValue: 26.61, investor: "Grupo", date: "2023-01-09", isPaid: true, observations: "" },
  { id: 80, type: "Parcela 2 - Empréstimo", value: 1643.28, paidValue: 1583.88, investor: "João", date: "2023-01-06", isPaid: true, observations: "" },
  { id: 81, type: "Parcela 2 - Empréstimo", value: 396.09, paidValue: 378.5, investor: "Mayck", date: "2023-01-06", isPaid: true, observations: "" },
  { id: 82, type: "Rastreador", value: 49.9, paidValue: 51.09, investor: "Grupo", date: "2023-02-22", isPaid: true, observations: "" },
  { id: 83, type: "Parcela 3 - Empréstimo", value: 1643.28, paidValue: 1583.88, investor: "João", date: "2023-02-06", isPaid: true, observations: "" },
  { id: 84, type: "Parcela 3 - Empréstimo", value: 396.09, paidValue: 378.5, investor: "Mayck", date: "2023-02-06", isPaid: true, observations: "" },
  { id: 85, type: "Rastreador", value: 49.9, paidValue: 49.9, investor: "Grupo", date: "2023-03-10", isPaid: true, observations: "" },
  { id: 86, type: "Parcela 4 - Empréstimo", value: 1643.28, paidValue: 1569.37, investor: "João", date: "2023-02-27", isPaid: true, observations: "" },
  { id: 87, type: "Parcela 4 - Empréstimo", value: 396.09, paidValue: 385.22, investor: "Mayck", date: "2023-03-18", isPaid: true, observations: "" },
  { id: 88, type: "Rastreador", value: 49.9, paidValue: 49.9, investor: "Grupo", date: "2023-04-10", isPaid: true, observations: "" },
  { id: 89, type: "Parcela 5 - Empréstimo", value: 1643.28, paidValue: 1548.54, investor: "João", date: "2023-03-18", isPaid: true, observations: "" },
  { id: 90, type: "Parcela 5 - Empréstimo", value: 396.09, paidValue: 391.83, investor: "Mayck", date: "2023-04-28", isPaid: true, observations: "" },
  { id: 91, type: "Rastreador", value: 49.9, paidValue: 49.9, investor: "Grupo", date: "2023-05-09", isPaid: true, observations: "" },
  { id: 92, type: "Parcela 6 - Empréstimo", value: 1643.28, paidValue: 1549.27, investor: "João", date: "2023-04-18", isPaid: true, observations: "" },
  { id: 93, type: "Parcela 6 - Empréstimo", value: 396.09, paidValue: 386.35, investor: "Mayck", date: "2023-05-20", isPaid: true, observations: "" },
  { id: 94, type: "Rastreador", value: 49.9, paidValue: 49.9, investor: "Grupo", date: "2023-06-09", isPaid: true, observations: "" },
  { id: 95, type: "Parcela 7 - Empréstimo", value: 1643.28, paidValue: 1552.23, investor: "João", date: "2023-05-20", isPaid: true, observations: "" },
  { id: 96, type: "Parcela 7 - Empréstimo", value: 396.09, paidValue: 382.54, investor: "Mayck", date: "2023-06-13", isPaid: true, observations: "" },
  { id: 97, type: "Rastreador", value: 49.9, paidValue: 49.9, investor: "Grupo", date: "2023-07-10", isPaid: true, observations: "" },
  { id: 98, type: "Parcela 8 - Empréstimo", value: 1643.28, paidValue: 1612.35, investor: "João", date: "2023-07-21", isPaid: true, observations: "" },
  { id: 99, type: "Parcela 8 - Empréstimo", value: 396.09, paidValue: 386.92, investor: "Mayck", date: "2023-07-22", isPaid: true, observations: "" },
  { id: 100, type: "Rastreador", value: 49.9, paidValue: 49.9, investor: "Grupo", date: "2023-08-07", isPaid: true, observations: "" },
  { id: 101, type: "Parcela 9 - Empréstimo", value: 1643.28, paidValue: 1643.28, investor: "João", date: "2023-08-07", isPaid: true, observations: "" },
  { id: 102, type: "Parcela 9 - Empréstimo", value: 396.09, paidValue: 396.1, investor: "Mayck", date: "2023-08-07", isPaid: true, observations: "" },
  { id: 103, type: "Rastreador", value: 49.9, paidValue: 49.9, investor: "Grupo", date: "2023-09-11", isPaid: true, observations: "" },
  { id: 104, type: "Parcela 10 - Empréstimo", value: 1643.28, paidValue: 1635.23, investor: "João", date: "2023-10-02", isPaid: true, observations: "" },
  { id: 105, type: "Parcela 10 - Empréstimo", value: 396.09, paidValue: 395.5, investor: "Mayck", date: "2023-10-05", isPaid: true, observations: "" },
  { id: 106, type: "Rastreador", value: 49.9, paidValue: 49.9, investor: "Grupo", date: "2023-10-13", isPaid: true, observations: "" },
  { id: 107, type: "Parcela 11 - Empréstimo", value: 1643.28, paidValue: 1643.28, investor: "João", date: "2023-11-06", isPaid: true, observations: "" },
  { id: 108, type: "Parcela 11 - Empréstimo", value: 396.09, paidValue: 396.09, investor: "Mayck", date: "2023-11-06", isPaid: true, observations: "" },
  { id: 109, type: "Rastreador", value: 49.9, paidValue: 50.95, investor: "Grupo", date: "2023-11-20", isPaid: true, observations: "" },
  { id: 110, type: "Parcela 12 - Empréstimo", value: 1643.28, paidValue: 1623.24, investor: "João", date: "2023-11-26", isPaid: true, observations: "" },
  { id: 111, type: "Parcela 12 - Empréstimo", value: 396.09, paidValue: 393.11, investor: "Mayck", date: "2023-12-01", isPaid: true, observations: "" },
  { id: 112, type: "Rastreador", value: 49.9, paidValue: 49.9, investor: "Grupo", date: "2023-12-12", isPaid: true, observations: "" },
  { id: 113, type: "Parcela 13 - Empréstimo", value: 1643.28, paidValue: 1583.88, investor: "João", date: "2023-12-06", isPaid: true, observations: "" },
  { id: 114, type: "Parcela 13 - Empréstimo", value: 396.09, paidValue: 390.33, investor: "Mayck", date: "2023-12-27", isPaid: true, observations: "" },
  { id: 115, type: "Rastreador", value: 52.15, paidValue: 52.15, investor: "Grupo", date: "2024-01-04", isPaid: true, observations: "" },
  { id: 116, type: "Parcela 14 - Empréstimo", value: 1643.28, paidValue: 1587.65, investor: "João", date: "2024-01-08", isPaid: true, observations: "" },
  { id: 117, type: "Parcela 14 - Empréstimo", value: 396.09, paidValue: 372.99, investor: "Mayck", date: "2023-12-27", isPaid: true, observations: "" },
  { id: 118, type: "Rastreador", value: 52.15, paidValue: 52.91, investor: "Grupo", date: "2024-02-15", isPaid: true, observations: "" },
  { id: 119, type: "Parcela 15 - Empréstimo", value: 1643.28, paidValue: 1598.02, investor: "João", date: "2024-02-12", isPaid: true, observations: "" },
  { id: 120, type: "Parcela 15 - Empréstimo", value: 396.09, paidValue: 356.42, investor: "Mayck", date: "2023-12-27", isPaid: true, observations: "" },
  { id: 121, type: "Rastreador", value: 52.15, paidValue: 52.75, investor: "Grupo", date: "2024-03-13", isPaid: true, observations: "" },
  { id: 122, type: "Parcela 16 - Empréstimo", value: 1643.28, paidValue: 1604.71, investor: "João", date: "2024-03-12", isPaid: true, observations: "" },
  { id: 123, type: "Parcela 16 - Empréstimo", value: 396.09, paidValue: 334.15, investor: "Mayck", date: "2023-12-14", isPaid: true, observations: "" },
  { id: 124, type: "Rastreador", value: 52.15, paidValue: 52.15, investor: "Grupo", date: "2024-04-15", isPaid: true, observations: "" },
  { id: 125, type: "Parcela 17 - Empréstimo", value: 1643.28, paidValue: 1572.64, investor: "João", date: "2024-04-01", isPaid: true, observations: "" },
  { id: 126, type: "Parcela 17 - Empréstimo", value: 396.09, paidValue: 319.3, investor: "Mayck", date: "2023-12-14", isPaid: true, observations: "" },
  { id: 127, type: "Rastreador", value: 52.15, paidValue: 52.15, investor: "Grupo", date: "2024-05-14", isPaid: true, observations: "" },
  { id: 128, type: "Parcela 18 - Empréstimo", value: 1643.28, paidValue: 1643.28, investor: "João", date: "2024-06-06", isPaid: true, observations: "" },
  { id: 129, type: "Parcela 18 - Empréstimo", value: 396.09, paidValue: 300.19, investor: "Mayck", date: "2024-03-03", isPaid: true, observations: "" },
  { id: 130, type: "Rastreador", value: 52.15, paidValue: 52.15, investor: "Grupo", date: "2024-06-17", isPaid: true, observations: "" },
  { id: 131, type: "Parcela 19 - Empréstimo", value: 1643.28, paidValue: 1641.26, investor: "João", date: "2024-07-08", isPaid: true, observations: "" },
  { id: 132, type: "Parcela 19 - Empréstimo", value: 396.09, paidValue: 182.91, investor: "Mayck", date: "2023-02-06", isPaid: true, observations: "" },
  { id: 133, type: "Rastreador", value: 52.15, paidValue: 52.15, investor: "Grupo", date: "2024-07-22", isPaid: true, observations: "" },
  { id: 134, type: "Parcela 20 - Empréstimo", value: 1643.28, paidValue: 1643.28, investor: "João", date: "2024-08-06", isPaid: true, observations: "" },
  { id: 135, type: "Parcela 20 - Empréstimo", value: 396.09, paidValue: 169.73, investor: "Mayck", date: "2023-01-17", isPaid: true, observations: "" },
  { id: 136, type: "Rastreador", value: 52.15, paidValue: 52.15, investor: "Grupo", date: "2024-08-08", isPaid: true, observations: "" },
  { id: 137, type: "Parcela 21 - Empréstimo", value: 1643.28, paidValue: 1643.28, investor: "João", date: "2024-09-06", isPaid: true, observations: "" },
  { id: 138, type: "Parcela 21 - Empréstimo", value: 396.09, paidValue: 162.19, investor: "Mayck", date: "2023-01-17", isPaid: true, observations: "" },
  { id: 139, type: "Rastreador", value: 52.15, paidValue: 52.15, investor: "Grupo", date: "2024-09-12", isPaid: true, observations: "" },
  { id: 140, type: "Rastreador", value: 52.15, paidValue: 52.15, investor: "Grupo", date: "2024-09-12", isPaid: true, observations: "" },
  { id: 141, type: "Parcela 22 - Empréstimo", value: 1643.28, paidValue: 1643.28, investor: "João", date: "2024-10-08", isPaid: true, observations: "" },
  { id: 142, type: "Parcela 22 - Empréstimo", value: 396.09, paidValue: 149.19, investor: "Mayck", date: "2022-12-22", isPaid: true, observations: "" },
  { id: 143, type: "Rastreador", value: 52.15, paidValue: 52.15, investor: "Grupo", date: "2024-10-12", isPaid: true, observations: "" },
  { id: 144, type: "Parcela 23 - Empréstimo", value: 1643.28, paidValue: 1633.22, investor: "João", date: "2024-10-01", isPaid: true, observations: "" },
  { id: 145, type: "Parcela 23 - Empréstimo", value: 396.09, paidValue: 142.56, investor: "Mayck", date: "2022-12-22", isPaid: true, observations: "" },
  { id: 146, type: "Rastreador", value: 52.15, paidValue: 52.15, investor: "Grupo", date: "2024-11-12", isPaid: true, observations: "" },
  { id: 147, type: "Parcela 24 - Empréstimo", value: 1643.28, paidValue: 1098.68, investor: "João", date: "2024-01-08", isPaid: true, observations: "" },
  { id: 148, type: "Parcela 24 - Empréstimo", value: 396.09, paidValue: 136.22, investor: "Mayck", date: "2022-12-22", isPaid: true, observations: "" },
  { id: 149, type: "Rastreador", value: 52.15, paidValue: 52.15, investor: "Grupo", date: "2024-12-12", isPaid: true, observations: "" }
];


const initialRentals: Rental[] = [
    { id: 1, clientName: 'Roberto Souza', clientCpf: '123.456.789-10', clientInitial: 'RS', clientPhone: '(11) 98765-4321', date: '2023-11-15', rentalType: 'Meia Diária', startTime: '09:00', endTime: '10:00', status: 'Pendente', location: 'Doca Principal - Marina Azul' },
    { id: 2, clientName: 'Ana Lima', clientCpf: '234.567.890-12', clientInitial: 'AL', clientPhone: '(21) 99887-6655', date: '2023-11-15', rentalType: 'Meia Diária', startTime: '10:30', endTime: '11:00', status: 'Confirmado', location: 'Doca Principal - Marina Azul' },
    { id: 3, clientName: 'Marcos Ferreira', clientCpf: '345.678.901-23', clientInitial: 'MF', clientPhone: '(47) 99111-2222', date: '2023-11-16', rentalType: 'Meia Diária', startTime: '14:00', endTime: '16:00', status: 'Concluído', location: 'Doca Principal - Marina Azul' },
    { id: 4, clientName: 'Julia Pereira', clientCpf: '456.789.012-34', clientInitial: 'JP', clientPhone: '(48) 98888-7777', date: '2023-11-17', rentalType: 'Diária', startTime: '08:00', endTime: '18:00', status: 'Pendente', location: 'Doca Principal - Marina Azul' },
    { id: 5, clientName: 'Thiago Costa', clientCpf: '567.890.123-45', clientInitial: 'TC', clientPhone: '(11) 97777-1111', date: '2023-11-18', rentalType: 'Meia Diária', startTime: '15:00', endTime: '16:00', status: 'Confirmado', location: 'Doca Principal - Marina Azul' },
];

const initialDashboardUsers: DashboardUser[] = [
  {
    id: '#001',
    name: 'Carlos Silva',
    email: 'jmsjetski@gmail.com',
    role: 'Gerente',
    status: 'Ativo',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5KV1c8iepweSrUE0mKWR4HNex6iAskIblPrIoDeAtHBkI0pepVeO3IsvT8A5O-EiaD1YLLeQJ7qZj8kY7bLq2qwMu5TVDWJ6Am5XVNLol3RJiTpU7R7JlFs6L7CXd7bUwfv3SmWRQdEGA6a_EThmdMtEKNcQmECNv7947DFxzjG6zReoS_U90ly3wXSL1uYSzDtIxv7yKs3LjKWxneOv4reF-JBcmgXi7IEOm3CKyl_ZDBt0ktqKWOkJ4HXQSc91OWAeZaNebHg',
  },
  {
    id: '#042',
    name: 'Ana Júlia',
    email: 'ana.julia@jetski.com',
    role: 'Atendimento',
    status: 'Ativo',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUmnYqSvK5VEO6PNROe3EX9yyUeRYUfRHr-BHhlMMx9OVWlaDUw93wzkv2ikGkrc6xDHVhH1dIEE-QK0YOZfVJNhhTd-67xPwR7Mr_urbN7Iyvv9IPMexhap_Pe7qZ-akNWsEHaFma0wSLfOBMUGCurq9yoqKj_qtitMhfkLDxyJemY7stzorfj7wBbaGFMTBmFuLNVX5R6DIpGhIWFFIfAj4NnNLtjaEAuhlLwbTXuyu1zOTwqOjDM0aAjAA_mfWnbA38_lNpQ',
  },
  {
    id: '#012',
    name: 'Roberto Mendes',
    email: 'beto.mendes@jetski.com',
    role: 'Instrutor',
    status: 'Inativo',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhW1tx5acNETNS6U9kEenIFm0aJqDB0wtHYQJ7_D18VZJ2PR-O1srAz3StILdjwiUDeunV621X66Eu_i59HnMOwfLHGMWejsSSDNpYlfqclUfCWT71RoTZmXNfHQCNbqx4i_ubnOdranmGUybwUuXDtAsWLuHTMXofGLseJomJuXz1zdfV0QcmN1uzjIRYjpOKghxwmjpGRhhVBckQHGC-g9l6DKvUcOlqymtFd1oq31xMOX1cA7HJIFJJl7ID1eOc2PYY2ubsug',
  },
];


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsers, setLoginUsers] = useState<User[]>([
    { email: 'jmsjetski@gmail.com', password: '123', fullName: 'Carlos Silva' }
  ]);
  const [dashboardUsers, setDashboardUsers] = useState<DashboardUser[]>(initialDashboardUsers);
  const [rentals, setRentals] = useState<Rental[]>(initialRentals);
  const [costs, setCosts] = useState<Cost[]>(initialCosts);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dashboardPage, setDashboardPage] = useState<DashboardPage>('dashboard');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigateToForgotPassword = () => {
    setCurrentPage('forgotPassword');
  };

  const navigateToLogin = () => {
    setCurrentPage('login');
  };

  const navigateToSignUp = () => {
    setCurrentPage('signUp');
  }

  const handleLoginSuccess = (user: User) => {
    const dashboardUser = dashboardUsers.find(du => du.email === user.email);

    const fullUser: User = {
        ...user,
        role: dashboardUser?.role || 'Visitante',
        imageUrl: dashboardUser?.imageUrl,
        fullName: dashboardUser?.name || user.fullName,
    };
    
    setIsAuthenticated(true);
    setCurrentUser(fullUser);
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('login');
    setDashboardPage('dashboard');
  };

  const handleAddNewLoginUser = (newUser: User) => {
    setLoginUsers(prevUsers => [...prevUsers, newUser]);
    navigateToLogin(); // Navigate to login after successful sign-up
  }

  const handleAddNewDashboardUser = (newUser: DashboardUser) => {
    setDashboardUsers(prev => [newUser, ...prev]);
    setSuccessMessage('Usuário salvo com sucesso!');
  };
  
  const handleUpdateDashboardUser = (updatedUser: DashboardUser) => {
    setDashboardUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
    if (currentUser && updatedUser.email === currentUser.email) {
      setCurrentUser(prev => ({
        ...prev!,
        fullName: updatedUser.name,
        role: updatedUser.role,
        imageUrl: updatedUser.imageUrl,
      }));
    }
    setSuccessMessage('Usuário salvo com sucesso!');
  };

  const handleDeleteDashboardUser = (userId: string) => {
    setDashboardUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleAddNewRental = (newRental: Rental) => {
    setRentals(prev => [newRental, ...prev]);
    setSuccessMessage('Locação salva com sucesso!');
  }

  const handleUpdateRental = (updatedRental: Rental) => {
    setRentals(prev => prev.map(r => r.id === updatedRental.id ? updatedRental : r));
    setSuccessMessage('Locação salva com sucesso!');
  }
  
  const handleDeleteRental = (rentalId: number) => {
    setRentals(prev => prev.filter(rental => rental.id !== rentalId));
    setSuccessMessage('Locação excluída com sucesso!');
  };

  const handleDashboardNavigation = (page: DashboardPage) => {
    setDashboardPage(page);
  }
  
  const handleAddNewCost = (newCost: Cost) => {
    setCosts(prev => [newCost, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setSuccessMessage('Custo adicionado com sucesso!');
  };

  const handleUpdateCost = (updatedCost: Cost) => {
      setCosts(prev => prev.map(c => c.id === updatedCost.id ? updatedCost : c));
      setSuccessMessage('Custo atualizado com sucesso!');
  };

  const handleDeleteCost = (costId: number) => {
      setCosts(prev => prev.filter(c => c.id !== costId));
      setSuccessMessage('Custo excluído com sucesso!');
  };


  if (isAuthenticated) {
    return <DashboardScreen 
      currentUser={currentUser} 
      users={dashboardUsers}
      rentals={rentals}
      costs={costs}
      activePage={dashboardPage}
      onNavigate={handleDashboardNavigation}
      onAddNewUser={handleAddNewDashboardUser}
      onUpdateUser={handleUpdateDashboardUser}
      onDeleteUser={handleDeleteDashboardUser}
      onAddNewRental={handleAddNewRental}
      onUpdateRental={handleUpdateRental}
      onDeleteRental={handleDeleteRental}
      onAddNewCost={handleAddNewCost}
      onUpdateCost={handleUpdateCost}
      onDeleteCost={handleDeleteCost}
      successMessage={successMessage}
      setSuccessMessage={setSuccessMessage}
      onLogout={handleLogout}
    />;
  }

  return (
    <div className="min-h-screen">
      {currentPage === 'login' && <LoginScreen users={loginUsers} onNavigateToForgotPassword={navigateToForgotPassword} onNavigateToSignUp={navigateToSignUp} onLoginSuccess={handleLoginSuccess} />}
      {currentPage === 'forgotPassword' && <ForgotPasswordScreen onNavigateToLogin={navigateToLogin} />}
      {currentPage === 'signUp' && <SignUpScreen onNavigateToLogin={navigateToLogin} onAddNewUser={handleAddNewLoginUser} />}
    </div>
  );
};

export default App;
