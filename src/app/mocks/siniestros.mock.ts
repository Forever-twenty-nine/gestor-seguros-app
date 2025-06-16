import { Siniestro } from '../models/siniestro.model';

export const SINIESTROS_MOCK: Siniestro[] = [
    {
        id: 'sin-1',
        clienteId: '1',
        polizaId: 'pol-1',
        fecha: new Date('2024-11-01'),
        tipoSiniestro: 'Accidente de auto',
        descripcion: 'Colisión leve sin heridos.',
        estado: 'reportado',
        documentosAdjuntos: [],
        empresaId: 'empresa1'
    },
    {
        id: 'sin-2',
        clienteId: '2',
        polizaId: 'pol-2',
        fecha: new Date('2024-12-10'),
        tipoSiniestro: 'Robo',
        descripcion: 'Robo de pertenencias del auto.',
        estado: 'en proceso',
        documentosAdjuntos: [],
        empresaId: 'empresa1'
    }
    ,
    {
        id: 'sin-3',
        clienteId: '3',
        polizaId: 'pol-3',
        fecha: new Date('2024-10-05'),
        tipoSiniestro: 'Incendio',
        descripcion: 'Incendio en el motor del vehículo.',
        estado: 'resuelto',
        documentosAdjuntos: [],
        empresaId: 'empresa2'
    },
    {
        id: 'sin-4',
        clienteId: '4',
        polizaId: 'pol-4',
        fecha: new Date('2024-09-15'),
        tipoSiniestro: 'Daños por granizo',
        descripcion: 'Daños en la carrocería por granizo.',
        estado: 'reportado',
        documentosAdjuntos: [],
        empresaId: 'empresa2'
    },
    {
        id: 'sin-5',
        clienteId: '5',
        polizaId: 'pol-5',
        fecha: new Date('2024-08-20'),
        tipoSiniestro: 'Accidente múltiple',
        descripcion: 'Colisión con varios vehículos involucrados.',
        estado: 'en proceso',
        documentosAdjuntos: [],
        empresaId: 'empresa3'
    }
];
