import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, GoogleAuthProvider, signInWithPopup, User as FirebaseUser } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { User } from '../models/user.model'
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private auth = inject(Auth);
    private firestore = inject(Firestore); // 👈 esta faltaba
    private userService = inject(UserService); // 👈 esta también
    private router = inject(Router);

    login(email: string, password: string) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    register(email: string, password: string) {
        return createUserWithEmailAndPassword(this.auth, email, password);
    }

    resetPassword(email: string) {
        return sendPasswordResetEmail(this.auth, email);
    }

    logout() {
        return signOut(this.auth).then(() => {
            this.router.navigateByUrl('/auth/login');
        });
    }

    async loginWithGoogle(): Promise<User> {
        try {
            const provider = new GoogleAuthProvider();
            const cred = await signInWithPopup(this.auth, provider);

            const firebaseUser = cred.user;
            if (!firebaseUser) throw new Error('No se pudo obtener el usuario de Google');

            const userRef = doc(this.firestore, 'users', firebaseUser.uid);
            const snap = await getDoc(userRef);

            if (!snap.exists()) {
                const nuevo: User = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email ?? '',
                    nombre: firebaseUser.displayName ?? '',
                    rol: 'admin',
                    empresaId: 'pendiente',
                    plan: 'free',
                    activo: true
                };

                await setDoc(userRef, nuevo);
            }

            const perfil = (await getDoc(userRef)).data() as User;
            this.userService.setUsuario(perfil);

            return perfil; // ✅ importante para el componente
        } catch (error) {
            console.error('❌ loginWithGoogle error:', error);
            throw error; // ✅ se propaga al .catch del componente
        }
    }
      

}
