import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private _usuario = signal<User | null>(null);

    constructor() {
        const saved = localStorage.getItem('usuario');
        if (saved) {
            try {
                const user = JSON.parse(saved) as User;
                this._usuario.set(user);
            } catch (e) {
                console.warn('Usuario inválido en localStorage');
                localStorage.removeItem('usuario');
            }
        }
    }

    logout() {
        this._usuario.set(null);
        localStorage.removeItem('usuario');
    }


    get usuario() {
        return this._usuario.asReadonly();
    }

    setUsuario(user: User) {
        this._usuario.set(user);
        localStorage.setItem('usuario', JSON.stringify(user));
    }

    cambiarNombre(nombre: string) {
        const actual = this._usuario();
        if (actual) {
            this._usuario.set({ ...actual, nombre });
        }
    }
    
}
