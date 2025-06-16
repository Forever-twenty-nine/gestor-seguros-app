export interface User {
    id: string;
    email: string;
    nombre: string;
    rol?: 'admin' | 'empleado';
    empresaId?: string;
    plan?: 'free' | 'basic' | 'premium';
    activo?: boolean;
}
