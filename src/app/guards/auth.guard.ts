import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  const usuario = userService.usuario();

  if (!usuario || !usuario.activo) {
    router.navigateByUrl('/auth/login');
    return false;
  }

  return true;
};

