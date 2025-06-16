export interface Siniestro {
    id: string;
    clienteId: string;
    polizaId: string;
    fecha: Date;
    tipoSiniestro: string;
    descripcion: string;
    estado: 'reportado' | 'en proceso' | 'resuelto';
    documentosAdjuntos?: string[];
    empresaId: string;
}
