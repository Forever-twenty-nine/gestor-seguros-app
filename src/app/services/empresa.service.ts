import { Injectable, signal,inject } from '@angular/core';
import { Empresa } from '../models/empresa.model';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private _empresa = signal<Empresa | null>(null);
  private firestore = inject(Firestore);

  get empresa() {
    return this._empresa.asReadonly();
  }

  async cargarEmpresaDesdeFirestore(empresaId: string) {
    const ref = doc(this.firestore, 'empresas', empresaId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const empresa = snap.data() as Empresa;
      this._empresa.set({ ...empresa, id: empresaId });
    }
  }

  async actualizarNombre(nombre: string) {
    const actual = this._empresa();
    if (!actual) return;

    const ref = doc(this.firestore, 'empresas', actual.id);
    await updateDoc(ref, { nombre });
    this._empresa.set({ ...actual, nombre });
  }

  async aumentarPolizaCount() {
    const actual = this._empresa();
    if (!actual) return;

    const ref = doc(this.firestore, 'empresas', actual.id);
    await updateDoc(ref, { polizaCount: actual.polizaCount + 1 });
    this._empresa.set({ ...actual, polizaCount: actual.polizaCount + 1 });
  }

  async cambiarConfiguracionAlertas(config: Empresa['configAlertas']) {
    const actual = this._empresa();
    if (!actual) return;

    const ref = doc(this.firestore, 'empresas', actual.id);
    await updateDoc(ref, { configAlertas: config });
    this._empresa.set({ ...actual, configAlertas: config });
  }
}
