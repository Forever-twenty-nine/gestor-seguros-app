import { Injectable, signal } from '@angular/core';
import { Siniestro } from '../models/siniestro.model';
import { SINIESTROS_MOCK } from '../mocks/siniestros.mock'; // nuevo

@Injectable({ providedIn: 'root' })
export class SiniestrosService {
    private _siniestros = signal<Siniestro[]>([]);

    get siniestros() {
        return this._siniestros.asReadonly();
    }

    constructor() {
        this._siniestros.set([...SINIESTROS_MOCK]); // carga inicial
    }

    agregarSiniestro(s: Siniestro) {
        this._siniestros.update(siniestros => [...siniestros, s]);
    }

    eliminarSiniestro(id: string) {
        this._siniestros.update(siniestros => siniestros.filter(s => s.id !== id));
    }

    actualizarSiniestro(s: Siniestro) {
        this._siniestros.update(siniestros =>
            siniestros.map(sin => (sin.id === s.id ? { ...s } : sin))
        );
    }

    getPorCliente(clienteId: string) {
        return this._siniestros().filter(s => s.clienteId === clienteId);
    }

    getPorPoliza(polizaId: string) {
        return this._siniestros().filter(s => s.polizaId === polizaId);
    }
}
