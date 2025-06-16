import { Injectable, signal } from '@angular/core';
import { Alerta } from '../models/alerta.model';

@Injectable({
    providedIn: 'root',
})
export class AlertasService {
    private _alertas = signal<Alerta[]>([]);

    get alertas() {
        return this._alertas.asReadonly();
    }

    cargarMockData() {
        const data: Alerta[] = [
            {
                id: 'a1',
                tipo: 'vencimiento',
                fechaProgramada: new Date('2025-01-01'),
                clienteId: '1',
                polizaId: 'p1',
                empresaId: 'empresa1',
                estado: 'pendiente',
                origen: 'auto',
            },
            {
                id: 'a2',
                tipo: 'siniestro',
                fechaProgramada: new Date('2024-12-20'),
                clienteId: '2',
                polizaId: 'p2',
                empresaId: 'empresa1',
                estado: 'atendida',
                origen: 'manual',
            }
        ];
        this._alertas.set(data);
    }

    agregarAlerta(alerta: Alerta) {
        this._alertas.update(alertas => [...alertas, alerta]);
    }

    eliminarAlerta(id: string) {
        this._alertas.update(alertas => alertas.filter(a => a.id !== id));
    }

    actualizarAlerta(alerta: Alerta) {
        this._alertas.update(alertas =>
            alertas.map(a => a.id === alerta.id ? alerta : a)
        );
    }
}
