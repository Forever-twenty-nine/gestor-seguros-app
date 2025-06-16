import { Injectable, signal } from '@angular/core';
import { Cliente } from '../models/cliente.model';

@Injectable({
    providedIn: 'root',
})
export class ClientesService {
    private _clientes = signal<Cliente[]>([]);

    // Observable readonly para usar en componentes
    get clientes() {
        return this._clientes.asReadonly();
    }

    // Cargar datos simulados (mock)
    cargarMockData() {
        const data: Cliente[] = [
            {
                id: '1',
                nombre: 'Juan Pérez',
                dniCuit: 20300111222,
                telefono: 1123456789,
                email: 'juan@example.com',
                direccion: 'Calle Falsa 123',
                empresaId: 'empresa1'
            },
            {
                id: '2',
                nombre: 'María Gómez',
                dniCuit: 27333444555,
                telefono: 1134567890,
                email: 'maria@example.com',
                direccion: 'Av. Siempreviva 742',
                empresaId: 'empresa1'
            }
        ];
        this._clientes.set(data);
    }

    // Agregar cliente
    agregarCliente(cliente: Cliente) {
        this._clientes.update(clientes => [...clientes, cliente]);
    }

    // Eliminar cliente por ID
    eliminarCliente(id: string) {
        this._clientes.update(clientes => clientes.filter(c => c.id !== id));
    }

    // Actualizar cliente
    actualizarCliente(cliente: Cliente) {
        this._clientes.update(clientes =>
            clientes.map(c => c.id === cliente.id ? cliente : c)
        );
    }
}
