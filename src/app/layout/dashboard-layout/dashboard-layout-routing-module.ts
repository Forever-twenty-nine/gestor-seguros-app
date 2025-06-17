import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayout } from './dashboard-layout';
import { authGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: '',
        loadChildren: () =>
          import('../../dashboard/dashboard-module').then(m => m.DashboardModule)
      },
      {
        path: 'clientes',
        loadChildren: () =>
          import('../../clientes/clientes-module').then(m => m.ClientesModule)
      },
      {
        path: 'polizas',
        loadChildren: () =>
          import('../../polizas/polizas-module').then(m => m.PolizasModule)
      },
      {
        path: 'siniestros',
        loadChildren: () =>
          import('../../siniestros/siniestros-module').then(m => m.SiniestrosModule)
      },
      {
        path: 'alertas',
        loadChildren: () =>
          import('../../alertas/alertas-module').then(m => m.AlertasModule)
      },
      {
        path: 'aseguradoras',
        loadChildren: () =>
          import('../../aseguradoras/aseguradoras-module').then(m => m.AseguradorasModule)
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('../../perfil/perfil-module').then(m => m.PerfilModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardLayoutRoutingModule { }
