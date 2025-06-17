import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Aseguradoras } from './aseguradoras/aseguradoras';

const routes: Routes = [
  { path: '', component: Aseguradoras, title: 'Aseguradoras' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AseguradorasRoutingModule { }
