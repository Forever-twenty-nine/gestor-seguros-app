import { Injectable, signal } from '@angular/core';
import { Aseguradora } from '../models/aseguradora.model';
import { ASEGURADORAS_MOCK } from '../mocks/aseguradoras.mock';

@Injectable({
  providedIn: 'root',
})
export class AseguradorasService {
  private _aseguradoras = signal<Aseguradora[]>([]);

  get aseguradoras() {
    return this._aseguradoras.asReadonly();
  }

  constructor() {
    this._aseguradoras.set(ASEGURADORAS_MOCK);
  }

  agregarAseguradora(aseguradora: Aseguradora) {
    this._aseguradoras.update(prev => [...prev, aseguradora]);
  }

  eliminarAseguradora(id: string) {
    this._aseguradoras.update(prev => prev.filter(a => a.id !== id));
  }

  actualizarAseguradora(aseguradora: Aseguradora) {
    this._aseguradoras.update(prev =>
      prev.map(a => a.id === aseguradora.id ? { ...aseguradora } : a)
    );
  }
}
