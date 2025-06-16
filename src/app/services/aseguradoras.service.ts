import { Injectable, signal } from '@angular/core';
import { Aseguradora } from '../models/aseguradora.model';

@Injectable({
    providedIn: 'root',
})
export class AseguradorasService {
    private _aseguradoras = signal<Aseguradora[]>([]);

    get aseguradoras() {
        return this._aseguradoras.asReadonly();
    }

    // Mock de aseguradoras
    cargarMockData() {
        const data: Aseguradora[] = [
            {
                id: 'aseg1',
                nombre: 'La Nueva Seguros',
                logoUrl: 'https://via.placeholder.com/100x50',
                emailContacto: 'contacto@lanueva.com',
            },
            {
                id: 'aseg2',
                nombre: 'Mapfre',
                logoUrl: 'https://via.placeholder.com/100x50',
                emailContacto: 'info@mapfre.com',
            }
        ];
        this._aseguradoras.set(data);
    }

    agregarAseguradora(aseguradora: Aseguradora) {
        this._aseguradoras.update(prev => [...prev, aseguradora]);
    }

    eliminarAseguradora(id: string) {
        this._aseguradoras.update(prev => prev.filter(a => a.id !== id));
    }

    actualizarAseguradora(aseguradora: Aseguradora) {
        this._aseguradoras.update(prev =>
            prev.map(a => a.id === aseguradora.id ? aseguradora : a)
        );
    }
}
