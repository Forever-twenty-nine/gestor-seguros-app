export interface Poliza {
  id?: string;
  clienteId: string;
  numero: string;
  empresaAseguradoraId: string;
  tipoSeguro: string;
  fechaInicio: Date;
  fechaVencimiento: Date;
  montoAsegurado: number;
  estado: string;
  adjuntos?: string[];
  
}

