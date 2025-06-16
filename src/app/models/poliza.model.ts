export interface Poliza {
    id?: string;
    clienteId: string;
    empresaAseguradoraId: string;
    tipoSeguro: string;
    fechaInicio: Date;
    fechaVencimiento: Date;
    montoAsegurado: number;
    estado: 'vigente' | 'por vencer' | 'vencida';
    adjuntos?: string[];
    empresaId: string;
}
