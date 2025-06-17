import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Perfil } from './perfil/perfil';
import { PerfilCuenta } from './perfil/perfil-cuenta/perfil-cuenta';

const routes: Routes = [
  {
    path: '',   component: PerfilCuenta
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilRoutingModule { }
