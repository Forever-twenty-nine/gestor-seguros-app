import { Poliza } from '../models/poliza.model';

export const MOCK_POLIZAS: Poliza[] = [
    {
        id: 'p1',
        clienteId: '1',
        empresaAseguradoraId: 'aseg1',
        tipoSeguro: 'Auto',
        fechaInicio: new Date('2024-01-01'),
        fechaVencimiento: new Date('2025-01-01'),
        montoAsegurado: 1500000,
        estado: 'vigente',
        empresaId: 'empresa1',
        adjuntos: [],
        numero: 'POL123456'
    },
    {
        id: 'p2',
        clienteId: '2',
        empresaAseguradoraId: 'aseg2',
        tipoSeguro: 'Hogar',
        fechaInicio: new Date('2023-09-15'),
        fechaVencimiento: new Date('2024-09-15'),
        montoAsegurado: 500000,
        estado: 'por vencer',
        empresaId: 'empresa1',
        adjuntos: [],
        numero: 'POL654321'
    }
];
  