import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { authState } from '@angular/fire/auth';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
    const auth = inject(Auth);
    const router = inject(Router);

    return authState(auth).pipe(
        map(user => {
            if (user) return true;
            router.navigateByUrl('/auth/login');
            return false;
        })
    );
};
