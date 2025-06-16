import { Injectable, signal } from '@angular/core';
import { Alerta } from '../models/alerta.model';
import { ALERTAS_MOCK } from '../mocks/alertas.mock';


@Injectable({ providedIn: 'root' })
export class AlertasService {
    private _alertas = signal<Alerta[]>([]);

    get alertas() {
        return this._alertas.asReadonly();
    }

    constructor() {
        this._alertas.set(ALERTAS_MOCK);
      }

    agregarAlerta(alerta: Alerta) {
        this._alertas.update(alertas => [...alertas, alerta]);
    }

    eliminarAlerta(id: string) {
        this._alertas.update(alertas => alertas.filter(a => a.id !== id));
    }

    actualizarAlerta(alerta: Alerta) {
        this._alertas.update(alertas =>
            alertas.map(a => (a.id === alerta.id ? { ...alerta } : a))
        );
    }

    getPorCliente(clienteId: string) {
        return this._alertas().filter(a => a.clienteId === clienteId);
    }
}
