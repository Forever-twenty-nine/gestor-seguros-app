import { Injectable, signal } from '@angular/core';
import { Empresa } from '../models/empresa.model';

@Injectable({
    providedIn: 'root',
})
export class EmpresaService {
    private _empresa = signal<Empresa | null>(null);

    get empresa() {
        return this._empresa.asReadonly();
    }

    // Simula la carga de la empresa asociada al usuario
    cargarEmpresaMock() {
        const empresaMock: Empresa = {
            id: 'empresa1',
            nombre: 'Seguros S.A.',
            plan: 'basic',
            polizaCount: 2,
            limitePolizas: 100,
            configAlertas: {
                diasAnticipacion: 30,
                metodos: ['email', 'visual'],
            },
        };
        this._empresa.set(empresaMock);
    }

    actualizarNombre(nombre: string) {
        const actual = this._empresa();
        if (actual) {
            this._empresa.set({ ...actual, nombre });
        }
    }

    aumentarPolizaCount() {
        const actual = this._empresa();
        if (actual) {
            this._empresa.set({ ...actual, polizaCount: actual.polizaCount + 1 });
        }
    }

    cambiarConfiguracionAlertas(config: Empresa['configAlertas']) {
        const actual = this._empresa();
        if (actual) {
            this._empresa.set({ ...actual, configAlertas: config });
        }
    }
}
