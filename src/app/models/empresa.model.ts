export interface Empresa {
    id: string;
    nombre: string;
    plan: 'free' | 'basic' | 'premium';
    polizaCount: number;
    limitePolizas: number;
    configAlertas: {
        diasAnticipacion: number;
        metodos: ('email' | 'visual')[];
    };
}
