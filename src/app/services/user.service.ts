import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private _usuario = signal<User | null>(null);

    get usuario() {
        return this._usuario.asReadonly();
    }

    // Simula login y carga del usuario
    loginMock() {
        const userMock: User = {
            id: 'u123',
            email: 'admin@empresa.com',
            nombre: 'Admin Principal',
            rol: 'admin',
            empresaId: 'empresa1',
            plan: 'basic',
            activo: true
        };
        this._usuario.set(userMock);
    }

    logoutMock() {
        this._usuario.set(null);
    }

    cambiarNombre(nombre: string) {
        const actual = this._usuario();
        if (actual) {
            this._usuario.set({ ...actual, nombre });
        }
    }

    cambiarPlan(plan: 'free' | 'basic' | 'premium') {
        const actual = this._usuario();
        if (actual) {
            this._usuario.set({ ...actual, plan });
        }
    }
}
