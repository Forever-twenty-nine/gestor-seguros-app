import { Injectable, signal, inject } from '@angular/core';
import { Empresa } from '../models/empresa.model';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class EmpresaService {
  private readonly _empresa = signal<Empresa | null>(null);
  private readonly firestore = inject(Firestore);

  // 📤 Getter reactivo readonly
  get empresa() {
    return this._empresa.asReadonly();
  }

  // 🔄 Cargar empresa por ID desde Firestore
  async cargarEmpresaDesdeFirestore(empresaId: string) {
    try {
      const ref = doc(this.firestore, 'empresas', empresaId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const empresa = snap.data() as Empresa;
        this._empresa.set({ ...empresa, id: empresaId });
      } else {
        console.warn(`⚠️ No se encontró la empresa con ID: ${empresaId}`);
        this._empresa.set(null);
      }
    } catch (err) {
      console.error('❌ Error al cargar empresa:', err);
      this._empresa.set(null);
    }
  }

  // ✏️ Actualizar nombre
  async actualizarNombre(nombre: string) {
    const empresa = this._empresa();
    if (!empresa) return;

    const ref = doc(this.firestore, 'empresas', empresa.id);
    await updateDoc(ref, { nombre });
    this._empresa.set({ ...empresa, nombre });
  }

  // ➕ Aumentar contador de pólizas
  async aumentarPolizaCount() {
    const empresa = this._empresa();
    if (!empresa) return;

    const ref = doc(this.firestore, 'empresas', empresa.id);
    const nuevoCount = empresa.polizaCount + 1;

    await updateDoc(ref, { polizaCount: nuevoCount });
    this._empresa.set({ ...empresa, polizaCount: nuevoCount });
  }

  // ⚙️ Cambiar configuración de alertas
  async cambiarConfiguracionAlertas(config: Empresa['configAlertas']) {
    const empresa = this._empresa();
    if (!empresa) return;

    const ref = doc(this.firestore, 'empresas', empresa.id);
    await updateDoc(ref, { configAlertas: config });
    this._empresa.set({ ...empresa, configAlertas: config });
  }
}
