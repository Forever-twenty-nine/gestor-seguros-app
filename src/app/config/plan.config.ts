export type PlanNombre = 'free' | 'basic' | 'premium';

export interface PlanConfig {
  nombre: PlanNombre;
  limitePolizas: number;
  limiteUsuarios: number;
}

export const PLANES_CONFIG: Record<PlanNombre, PlanConfig> = {
  free: {
    nombre: 'free',
    limitePolizas: 10,
    limiteUsuarios: 1,
  },
  basic: {
    nombre: 'basic',
    limitePolizas: 100,
    limiteUsuarios: 3,
  },
  premium: {
    nombre: 'premium',
    limitePolizas: Infinity,
    limiteUsuarios: 5,
  },
};
