import { Injectable, inject, signal, computed, effect } from '@angular/core';
import {
    Firestore,
    collection,
    collectionData,
    doc,
    setDoc,
    deleteDoc,
    query,
    where,
    CollectionReference
} from '@angular/fire/firestore';
import { Cliente } from '../models/cliente.model';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class ClientesService {
    private firestore = inject(Firestore);
    private userService = inject(UserService);

    // 🔁 Signal reactivo que contiene los clientes
    private _clientes = signal<Cliente[]>([]);
    get clientes() {
        return this._clientes.asReadonly();
    }

    // 🏢 empresaId actual del usuario logueado
    private empresaId = this.userService.empresaId;

    constructor() {
        // 📦 Cargar automáticamente clientes de Firebase cuando hay empresaId
        effect(() => {
            const empresaId = this.empresaId();
            if (!empresaId) return;

            const ref = collection(this.firestore, 'clientes') as CollectionReference<Cliente>;
            const q = query(ref, where('empresaId', '==', empresaId));

            collectionData(q, { idField: 'id' }).subscribe((clientes) => {
                this._clientes.set(clientes);
            });
        });
    }

    /**
     * 🔄 Guarda (crea o actualiza) un cliente en Firestore
     */
    guardarCliente(cliente: Cliente) {
        const empresaId = this.empresaId();
        if (!empresaId) {
            throw new Error('No se puede guardar cliente: empresaId es null');
        }

        if (!cliente.id) {
            cliente.id = crypto.randomUUID();
        }

        cliente.empresaId = empresaId;
        const ref = doc(this.firestore, 'clientes', cliente.id);
        return setDoc(ref, cliente);
    }


    /**
     * ❌ Elimina un cliente por su ID
     */
    eliminarCliente(id: string) {
        const ref = doc(this.firestore, 'clientes', id);
        return deleteDoc(ref);
    }

    /**
     * 🔍 Obtiene el nombre de un cliente desde el listado en memoria
     */
    getClienteNombrePorId(id: string): string {
        const cliente = this._clientes().find(c => String(c.id) === String(id));
        return cliente?.nombre ?? '—';
    }
}
