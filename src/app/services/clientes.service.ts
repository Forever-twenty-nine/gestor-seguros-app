import { Injectable, signal } from '@angular/core';
import { Cliente } from '../models/cliente.model';
import { CLIENTES_MOCK } from '../mocks/clientes.mock';

@Injectable({
    providedIn: 'root',
})
export class ClientesService {
    private _clientes = signal<Cliente[]>([]);

    get clientes() {
        return this._clientes.asReadonly();
    }

    constructor() {
        this._clientes.set([...CLIENTES_MOCK]); // ✅ carga automática de mock
    }

    agregarCliente(cliente: Cliente) {
        this._clientes.update(clientes => [...clientes, cliente]);
    }

    eliminarCliente(id: string) {
        this._clientes.update(clientes => clientes.filter(c => c.id !== id));
    }

    actualizarCliente(cliente: Cliente) {
        this._clientes.update(clientes =>
            clientes.map(c => (c.id === cliente.id ? { ...cliente } : { ...c }))
        );
    }

    getClienteNombrePorId(id: string): string {
        const cliente = this._clientes().find(c => String(c.id) === String(id));
        return cliente?.nombre ?? '—';
    }
}