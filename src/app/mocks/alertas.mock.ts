import { Alerta } from '../models/alerta.model';

export const ALERTAS_MOCK: Alerta[] = [
    {
        id: 'a1',
        tipo: 'vencimiento',
        fechaProgramada: new Date('2025-07-01T10:00:00'),
        clienteId: '1', // Juan Pérez
        polizaId: 'p1',
        empresaId: 'empresa1',
        estado: 'pendiente',
        origen: 'auto'
    },
    {
        id: 'a2',
        tipo: 'siniestro',
        fechaProgramada: new Date('2025-07-15T15:30:00'),
        clienteId: '2', // María Gómez
        polizaId: 'p3',
        empresaId: 'empresa1',
        estado: 'atendida',
        origen: 'manual'
    },
    {
        id: 'a3',
        tipo: 'vencimiento',
        fechaProgramada: new Date('2025-06-25T08:00:00'),
        clienteId: '4', // Lucía Fernández
        polizaId: 'p5',
        empresaId: 'empresa1',
        estado: 'pendiente',
        origen: 'auto'
    },
    {
        id: 'a4',
        tipo: 'siniestro',
        fechaProgramada: new Date('2025-07-10T14:45:00'),
        clienteId: '3', // Carlos Rodríguez
        polizaId: 'p4',
        empresaId: 'empresa1',
        estado: 'pendiente',
        origen: 'manual'
    },
    {
        id: 'a5',
        tipo: 'vencimiento',
        fechaProgramada: new Date('2025-07-30T09:30:00'),
        clienteId: '5', // Ricardo López
        polizaId: 'p7',
        empresaId: 'empresa1',
        estado: 'pendiente',
        origen: 'auto'
    }
];
