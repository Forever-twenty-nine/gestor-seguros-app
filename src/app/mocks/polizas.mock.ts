import { Poliza } from '../models/poliza.model';

export const MOCK_POLIZAS: Poliza[] = [
    // Cliente 1 - Juan Pérez
    {
        id: 'p1',
        clienteId: '1',
        empresaAseguradoraId: 'aseg1',
        tipoSeguro: 'Auto',
        fechaInicio: new Date('2024-01-01'),
        fechaVencimiento: new Date('2025-01-01'),
        montoAsegurado: 1500000,
        estado: 'vigente',
        adjuntos: [],
        numero: 'POL123456'
    },
    {
        id: 'p2',
        clienteId: '1',
        empresaAseguradoraId: 'aseg2',
        tipoSeguro: 'Vida',
        fechaInicio: new Date('2022-06-10'),
        fechaVencimiento: new Date('2023-06-10'),
        montoAsegurado: 800000,
        estado: 'vencida',
        adjuntos: [],
        numero: 'POL223344'
    },

    // Cliente 2 - María Gómez
    {
        id: 'p3',
        clienteId: '2',
        empresaAseguradoraId: 'aseg2',
        tipoSeguro: 'Hogar',
        fechaInicio: new Date('2023-09-15'),
        fechaVencimiento: new Date('2024-09-15'),
        montoAsegurado: 500000,
        estado: 'por vencer',
        adjuntos: [],
        numero: 'POL654321'
    },

    // Cliente 3 - Carlos Rodríguez
    {
        id: 'p4',
        clienteId: '3',
        empresaAseguradoraId: 'aseg3',
        tipoSeguro: 'Comercio',
        fechaInicio: new Date('2024-03-01'),
        fechaVencimiento: new Date('2025-03-01'),
        montoAsegurado: 1200000,
        estado: 'vigente',
        adjuntos: [],
        numero: 'POL991122'
    },

    // Cliente 4 - Lucía Fernández (2 pólizas)
    {
        id: 'p5',
        clienteId: '4',
        empresaAseguradoraId: 'aseg4',
        tipoSeguro: 'Auto',
        fechaInicio: new Date('2023-01-01'),
        fechaVencimiento: new Date('2024-01-01'),
        montoAsegurado: 900000,
        estado: 'por vencer',
        adjuntos: [],
        numero: 'POL334455'
    },
    {
        id: 'p6',
        clienteId: '4',
        empresaAseguradoraId: 'aseg5',
        tipoSeguro: 'Vida',
        fechaInicio: new Date('2022-11-01'),
        fechaVencimiento: new Date('2023-11-01'),
        montoAsegurado: 700000,
        estado: 'vencida',
        adjuntos: [],
        numero: 'POL778899'
    },

    // Cliente 5 - Ricardo López
    {
        id: 'p7',
        clienteId: '5',
        empresaAseguradoraId: 'aseg2',
        tipoSeguro: 'Hogar',
        fechaInicio: new Date('2024-04-01'),
        fechaVencimiento: new Date('2025-04-01'),
        montoAsegurado: 600000,
        estado: 'vigente',
        adjuntos: [],
        numero: 'POL445566'
    }
];
