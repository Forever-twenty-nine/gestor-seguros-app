import { Aseguradora } from '../models/aseguradora.model';

export const ASEGURADORAS_MOCK: Aseguradora[] = [
  {
    id: 'aseg1',
    nombre: 'La Nueva Seguros',
    emailContacto: 'contacto@lanueva.com',
    logoUrl: 'https://via.placeholder.com/100x50?text=La+Nueva',
    telefono: '0810-999-4567',
    direccion: 'Av. Independencia 1234, CABA',
    empresaId: 'empresa1'
  },
  {
    id: 'aseg2',
    nombre: 'Mapfre Argentina',
    emailContacto: 'info@mapfre.com.ar',
    logoUrl: 'https://via.placeholder.com/100x50?text=Mapfre',
    telefono: '0800-222-7424',
    direccion: 'Calle Falsa 123, Córdoba',
    empresaId: 'empresa1'
  },
  {
    id: 'aseg3',
    nombre: 'Sancor Seguros',
    emailContacto: 'atencion@sancorseguros.com.ar',
    logoUrl: 'https://via.placeholder.com/100x50?text=Sancor',
    telefono: '0800-444-2850',
    direccion: 'San Martín 789, Rosario',
    empresaId: 'empresa1'
  }
];
