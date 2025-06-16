export interface Cliente {
    id: string;
    nombre: string;
    dniCuit: number;
    telefono: number;
    email: string;
    direccion: string;
    empresaId: string;// relacion con la empresa a la que pertenece el cliente
}
