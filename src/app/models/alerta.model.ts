export interface Alerta {
    id: string;
    tipo: 'vencimiento' | 'siniestro';
    fechaProgramada: Date;
    clienteId: string;
    polizaId?: string;
    empresaId: string;
    estado: 'pendiente' | 'atendida';
    origen: 'auto' | 'manual';
}
