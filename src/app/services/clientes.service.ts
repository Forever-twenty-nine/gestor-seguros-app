import { Injectable, signal } from '@angular/core';
import { Cliente } from '../models/cliente.model';
import { CLIENTES_MOCK } from '../mocks/clientes.mock';

@Injectable({
    providedIn: 'root',
})
export class ClientesService {
    // Signal reactivo privado
    private _clientes = signal<Cliente[]>([]);

    // Signal público de solo lectura para los componentes
    get clientes() {
        return this._clientes.asReadonly();
    }

    // Cargar datos simulados
    cargarMockData() {
        this._clientes.set([...CLIENTES_MOCK]);
    }

    // Agrega un nuevo cliente al listado
    agregarCliente(cliente: Cliente) {
        this._clientes.update(clientes => [...clientes, cliente]);
    }

    // Elimina un cliente por su ID
    eliminarCliente(id: string) {
        this._clientes.update(clientes =>
            clientes.filter(c => c.id !== id)
        );
    }

    // Actualiza los datos de un cliente existente
    actualizarCliente(cliente: Cliente) {
        this._clientes.update(clientes =>
            clientes.map(c =>
                c.id === cliente.id ? { ...cliente } : { ...c } // Clonar todos para asegurar reactividad
            )
        );
    }
}
