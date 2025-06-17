import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const empresaCompletaGuard: CanActivateFn = async () => {
  const userService = inject(UserService);
  const router = inject(Router);
  const firestore = inject(Firestore);

  const user = userService.usuario();

  if (!user || user.rol !== 'admin' || !user.empresaId) return true;

  const empresaRef = doc(firestore, 'empresas', user.empresaId);
  const snap = await getDoc(empresaRef);

  const nombre = snap.get('nombre') ?? '';
  if (!nombre.trim()) {
    router.navigateByUrl('/perfil');
    return false;
  }

  return true;
};
