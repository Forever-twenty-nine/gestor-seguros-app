import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Poliza } from '../../models/poliza.model';
import { PolizasService } from '../../services/polizas.service';
import { FieldMeta, camposPoliza, generateFormGroup } from '../../utils/form-utils';

import { Table } from '../../components/ui/table/table';
import { TableDetail } from '../../components/ui/table-detail/table-detail';
import { TableForm } from '../../components/ui/table-form/table-form';
import { TableConfirm } from '../../components/ui/table-confirm/table-confirm';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-polizas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Table, TableDetail, TableForm, TableConfirm],
  templateUrl: './polizas.html',
})
export class Polizas {
  private fb = inject(FormBuilder);
  private service = inject(PolizasService);
  private toast = inject(ToastService);

  polizas = this.service.polizas;

  columnas = ['Número', 'Tipo', 'Aseguradora'];
  campos = ['numero', 'tipo', 'aseguradora'];
  acciones = ['ver', 'editar', 'eliminar'];

  modoEdicion = false;
  formularioVisible = false;
  polizaSeleccionada: Poliza | null = null;
  polizaParaEliminar: Poliza | null = null;

  formFields: FieldMeta[] = camposPoliza;
  form: FormGroup = this.fb.group({
    ...generateFormGroup(this.fb, this.formFields).controls,
    id: this.fb.control(''),
    clienteId: this.fb.control('cliente1'),
  });

  constructor() {
    this.service.cargarMockData();
  }

  manejarAccion(event: { action: string; row: Poliza }) {
    if (event.action === 'ver') {
      this.polizaSeleccionada = event.row;
    } else if (event.action === 'editar') {
      this.modoEdicion = true;
      this.form.setValue({ ...event.row });
      this.formularioVisible = true;
    } else if (event.action === 'eliminar') {
      this.polizaParaEliminar = event.row;
    }
  }

  abrirFormulario() {
    this.modoEdicion = false;
    this.form.reset({ clienteId: 'cliente1' });
    this.formularioVisible = true;
  }

  cerrarFormulario() {
    this.formularioVisible = false;
  }

  guardarFormulario() {
    const poliza = this.form.value as Poliza;

    if (this.modoEdicion) {
      this.service.actualizarPoliza(poliza);
      this.toast.show('Póliza actualizada', 'success');
    } else {
      poliza.id = crypto.randomUUID();
      this.service.agregarPoliza(poliza);
      this.toast.show('Póliza creada', 'success');
    }

    this.formularioVisible = false;
  }

  cerrarDetalle() {
    this.polizaSeleccionada = null;
  }

  cancelarEliminacion() {
    this.polizaParaEliminar = null;
  }

  confirmarEliminacion() {
    this.service.eliminarPoliza(this.polizaParaEliminar!.id!);
    this.toast.show('Póliza eliminada', 'success');
    this.polizaParaEliminar = null;
  }
}
