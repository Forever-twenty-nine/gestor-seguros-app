import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Alertas } from './alertas/alertas';

const routes: Routes = [
  { path: '', component: Alertas }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertasRoutingModule { }
