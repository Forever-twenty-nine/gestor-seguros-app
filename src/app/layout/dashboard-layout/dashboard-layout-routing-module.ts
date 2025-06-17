import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayout } from './dashboard-layout';
import { authGuard } from '../../guards/auth.guard';
import { empresaCompletaGuard } from '../../guards/empresa-completa.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: '',
        canActivate: [empresaCompletaGuard],
        loadChildren: () =>
          import('../../dashboard/dashboard-module').then(m => m.DashboardModule)
      },
      {
        path: 'clientes',
        canActivate: [empresaCompletaGuard],
        loadChildren: () =>
          import('../../clientes/clientes-module').then(m => m.ClientesModule)
      },
      {
        path: 'polizas',
        canActivate: [empresaCompletaGuard],
        loadChildren: () =>
          import('../../polizas/polizas-module').then(m => m.PolizasModule)
      },
      {
        path: 'siniestros',
        canActivate: [empresaCompletaGuard],
        loadChildren: () =>
          import('../../siniestros/siniestros-module').then(m => m.SiniestrosModule)
      },
      {
        path: 'alertas',
        canActivate: [empresaCompletaGuard],
        loadChildren: () =>
          import('../../alertas/alertas-module').then(m => m.AlertasModule)
      },
      {
        path: 'aseguradoras',
        canActivate: [empresaCompletaGuard],
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
