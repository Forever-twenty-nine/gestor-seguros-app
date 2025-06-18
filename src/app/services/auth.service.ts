import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
    Auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    User as FirebaseUser
} from '@angular/fire/auth';
import {
    Firestore,
    doc,
    getDoc,
    setDoc
} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { Empresa } from '../models/empresa.model';
import { PLANES_CONFIG } from '../config/plan.config';

import { UserService } from './user.service';
import { EmpresaService } from './empresa.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private auth = inject(Auth);
    private firestore = inject(Firestore);
    private userService = inject(UserService);
    private router = inject(Router);
    private empresaService = inject(EmpresaService);

    // 🔐 Login tradicional
    login(email: string, password: string) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    // 🧩 Registro con email/contraseña
    async register(email: string, password: string) {
        const cred = await createUserWithEmailAndPassword(this.auth, email, password);
        const uid = cred.user.uid;
        const plan = PLANES_CONFIG['free'];

        const nombreEmpresa = email.split('@')[0].replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'Mi empresa';

        const empresa: Empresa = {
            id: uid,
            nombre: nombreEmpresa,
            plan: plan.nombre,
            polizaCount: 0,
            limitePolizas: plan.limitePolizas,
            limiteUsuarios: plan.limiteUsuarios,
            configAlertas: {
                diasAnticipacion: 30,
                metodos: ['visual']
            }
        };

        const usuario: User = {
            id: uid,
            email,
            nombre: '',
            rol: 'admin',
            empresaId: uid,
            activo: true
        };

        // 📄 Guardar documentos iniciales
        await setDoc(doc(this.firestore, 'empresas', uid), empresa, { merge: true });

        await setDoc(doc(this.firestore, 'users', uid), usuario);

        this.userService.setUsuario({ ...usuario, empresaNombre: empresa.nombre });
        this.router.navigateByUrl('/perfil');
    }

    // 🔐 Recuperación de contraseña
    resetPassword(email: string) {
        return sendPasswordResetEmail(this.auth, email);
    }

    // 🚪 Logout con limpieza local
    logout() {
        return signOut(this.auth).then(() => {
            this.userService.logout();
            this.router.navigateByUrl('/auth/login');
        });
    }

    // 🔒 Login con Google
    async loginWithGoogle(): Promise<User> {
        try {
            const provider = new GoogleAuthProvider();
            const cred = await signInWithPopup(this.auth, provider);
            const firebaseUser = cred.user;
            if (!firebaseUser) throw new Error('No se pudo obtener el usuario de Google');

            const userRef = doc(this.firestore, 'users', firebaseUser.uid);
            const snap = await getDoc(userRef);

            // 🟨 Si es un usuario nuevo: crear empresa y perfil
            if (!snap.exists()) {
                const plan = PLANES_CONFIG['free'];

                const nombreEmpresa = (firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'Mi empresa')
                    .replace(/[^a-zA-Z0-9 ]/g, '')
                    .trim() || 'Mi empresa';

                const nuevaEmpresa: Empresa = {
                    id: firebaseUser.uid,
                    nombre: nombreEmpresa,
                    plan: plan.nombre,
                    polizaCount: 0,
                    limitePolizas: plan.limitePolizas,
                    limiteUsuarios: plan.limiteUsuarios,
                    configAlertas: {
                        diasAnticipacion: 30,
                        metodos: ['visual']
                    }
                };

                const nuevoUsuario: User = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email ?? '',
                    nombre: firebaseUser.displayName ?? '',
                    rol: 'admin',
                    empresaId: firebaseUser.uid,
                    activo: true
                };

                await setDoc(doc(this.firestore, 'empresas', nuevaEmpresa.id), nuevaEmpresa, { merge: true });
                await setDoc(userRef, nuevoUsuario);
            }

            // 🧠 Cargar perfil desde Firestore
            const perfil = (await getDoc(userRef)).data() as User;

            const empresaSnap = await getDoc(doc(this.firestore, 'empresas', perfil.empresaId));
            const empresaNombre = empresaSnap.get('nombre') ?? '';

            this.userService.setUsuario({ ...perfil, empresaNombre });


            await this.verificarEmpresaYRedirigir(perfil);
            return perfil;

        } catch (error) {
            console.error('❌ loginWithGoogle error:', error);
            throw error;
        }
    }

    // ✅ Verificación de empresa y redirección si falta completar
    private async verificarEmpresaYRedirigir(usuario: User) {
        const empresaRef = doc(this.firestore, 'empresas', usuario.empresaId);
        const snap = await getDoc(empresaRef);
        const nombre = snap.get('nombre');

        // ⚠️ Si falta nombre, redirigir al perfil
        if (!snap.exists() || !nombre || !String(nombre).trim()) {
            this.router.navigateByUrl('/perfil');
        } else {
            await this.empresaService.cargarEmpresaDesdeFirestore(usuario.empresaId);
        }
    }
}
