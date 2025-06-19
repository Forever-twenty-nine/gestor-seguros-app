import { Injectable, computed, inject, signal } from '@angular/core';
import {
    Firestore,
    collection,
    collectionData,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    setDoc
} from '@angular/fire/firestore';

import { Poliza } from '../models/poliza.model';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class PolizasService {
    // 🔌 Inyectamos Firestore y el UserService
    private firestore = inject(Firestore);
    private userService = inject(UserService);

    // 🏢 Obtenemos empresaId desde el perfil cargado por el usuario
    private getEmpresaId(): string {
        return this.userService.usuario()?.empresaId ?? '';
    }


    // 📦 Estado reactivo de pólizas
    private _polizas = signal<Poliza[]>([]);

    constructor() {
        this.cargarPolizas(); // 🚀 Escuchamos Firebase al iniciar
    }

    // 📤 Getter público y reactivo de pólizas
    get polizas() {
        return this._polizas.asReadonly();
    }

    // 🔄 Escucha en tiempo real desde Firebase (Firestore)
    cargarPolizas() {
        const empresaId = this.getEmpresaId();
        if (!empresaId) return;

        const ref = collection(this.firestore, 'empresas', empresaId, 'polizas');
        const q = query(ref);

        onSnapshot(q, (snapshot) => {
            const data: Poliza[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Poliza[];

            this._polizas.set(data);
        });
    }


    // 💾 Crear o actualizar una póliza en Firebase
    async guardarPoliza(poliza: Poliza) {
        const empresaId = this.getEmpresaId();
        if (!empresaId) return;

        const ref = doc(this.firestore, 'empresas', empresaId, 'polizas', poliza.id!); // ✅ aseguramos que es string
        await setDoc(ref, poliza, { merge: true });
    }


    // 🗑️ Eliminar póliza por ID
    async eliminarPoliza(id: string) {
        const empresaId = this.getEmpresaId();
        if (!empresaId) return;

        const ref = doc(this.firestore, 'empresas', empresaId, 'polizas', id);
        await deleteDoc(ref);
    }

    // 🔍 Obtener pólizas por cliente
    getPolizasPorCliente(clienteId: string): Poliza[] {
        return this._polizas().filter(p => String(p.clienteId) === String(clienteId));
    }

    // 🔎 Obtener una póliza por ID
    getPolizaById(id: string): Poliza | undefined {
        return this._polizas().find(p => p.id === id);
    }
}
