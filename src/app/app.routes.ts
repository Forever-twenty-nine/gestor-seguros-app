import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./layout/dashboard-layout/dashboard-layout-module').then(m => m.DashboardLayoutModule)
    },
    { path: '**', redirectTo: '' }
];
