import { Injectable, signal } from '@angular/core';
import { Siniestro } from '../models/siniestro.model';

@Injectable({
    providedIn: 'root',
})
export class SiniestrosService {
    private _siniestros = signal<Siniestro[]>([]);

    get siniestros() {
        return this._siniestros.asReadonly();
    }

    cargarMockData() {
        const data: Siniestro[] = [
            {
                id: 's1',
                clienteId: '1',
                polizaId: 'p1',
                fecha: new Date('2024-05-10'),
                tipoSiniestro: 'Accidente de auto',
                descripcion: 'Colisión en la ruta 9',
                estado: 'en proceso',
                documentosAdjuntos: [],
                empresaId: 'empresa1'
            },
            {
                id: 's2',
                clienteId: '2',
                polizaId: 'p2',
                fecha: new Date('2023-12-01'),
                tipoSiniestro: 'Daño por agua',
                descripcion: 'Inundación en cocina',
                estado: 'resuelto',
                documentosAdjuntos: [],
                empresaId: 'empresa1'
            }
        ];
        this._siniestros.set(data);
    }

    agregarSiniestro(siniestro: Siniestro) {
        this._siniestros.update(list => [...list, siniestro]);
    }

    eliminarSiniestro(id: string) {
        this._siniestros.update(list => list.filter(s => s.id !== id));
    }

    actualizarSiniestro(siniestro: Siniestro) {
        this._siniestros.update(list =>
            list.map(s => s.id === siniestro.id ? siniestro : s)
        );
    }
}
