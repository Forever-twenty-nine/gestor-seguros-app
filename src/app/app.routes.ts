import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        loadChildren: () =>
            import('./layout/dashboard-layout/dashboard-layout-module').then(m => m.DashboardLayoutModule)
    },
    { path: '**', redirectTo: '' }
];
  
