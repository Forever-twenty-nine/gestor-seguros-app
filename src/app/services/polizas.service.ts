import { Injectable, signal } from '@angular/core';
import { Poliza } from '../models/poliza.model';

@Injectable({
    providedIn: 'root',
})
export class PolizasService {
    private _polizas = signal<Poliza[]>([]);

    get polizas() {
        return this._polizas.asReadonly();
    }

    // Cargar datos simulados
    cargarMockData() {
        const data: Poliza[] = [
            {
                id: 'p1',
                clienteId: '1',
                empresaAseguradoraId: 'aseg1',
                tipoSeguro: 'Auto',
                fechaInicio: new Date('2024-01-01'),
                fechaVencimiento: new Date('2025-01-01'),
                montoAsegurado: 1500000,
                estado: 'vigente',
                empresaId: 'empresa1',
                adjuntos: [],
            },
            {
                id: 'p2',
                clienteId: '2',
                empresaAseguradoraId: 'aseg2',
                tipoSeguro: 'Hogar',
                fechaInicio: new Date('2023-09-15'),
                fechaVencimiento: new Date('2024-09-15'),
                montoAsegurado: 500000,
                estado: 'por vencer',
                empresaId: 'empresa1',
                adjuntos: [],
            }
        ];
        this._polizas.set(data);
    }

    agregarPoliza(poliza: Poliza) {
        this._polizas.update(p => [...p, poliza]);
    }

    eliminarPoliza(id: string) {
        this._polizas.update(p => p.filter(poliza => poliza.id !== id));
    }

    actualizarPoliza(poliza: Poliza) {
        this._polizas.update(p =>
            p.map(existing => existing.id === poliza.id ? poliza : existing)
        );
    }
}
