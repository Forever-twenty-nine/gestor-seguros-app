import { Injectable, signal } from '@angular/core';
import { Poliza } from '../models/poliza.model';
import { MOCK_POLIZAS } from '../mocks/polizas.mock';

@Injectable({ providedIn: 'root' })
export class PolizasService {
    // Estado reactivo de pólizas
    private _polizas = signal<Poliza[]>([]);

    // Getter de solo lectura para suscripción desde componentes
    get polizas() {
        return this._polizas.asReadonly();
    }

    // Cargar datos mock
    cargarMockData() {
        this._polizas.set(MOCK_POLIZAS);
    }

    // Agregar una nueva póliza
    agregarPoliza(poliza: Poliza) {
        this._polizas.update(p => [...p, poliza]);
    }

    // Eliminar póliza por ID
    eliminarPoliza(id: string) {
        this._polizas.update(p => p.filter(poliza => poliza.id !== id));
    }

    // Actualizar póliza existente
    actualizarPoliza(poliza: Poliza) {
        this._polizas.update(p =>
            p.map(existing => existing.id === poliza.id ? { ...poliza } : existing)
        );
    }
}
