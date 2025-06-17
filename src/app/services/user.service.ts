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

    setUsuario(user: User) {
        this._usuario.set(user);
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
