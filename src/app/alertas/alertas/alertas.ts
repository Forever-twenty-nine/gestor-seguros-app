import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Table } from '../../components/ui/table/table';
import { TableForm } from '../../components/ui/table-form/table-form';
import { TableDetail } from '../../components/ui/table-detail/table-detail';
import { TableConfirm } from '../../components/ui/table-confirm/table-confirm';

import { Alerta } from '../../models/alerta.model';
import { AlertasService } from '../../services/alertas.service';
import { ToastService } from '../../services/toast.service';
import { camposAlerta, FieldMeta, generateFormGroup, mapRowToForm } from '../../utils/form-utils';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Table, TableForm, TableDetail, TableConfirm],
  templateUrl: './alertas.html',
})
export class Alertas {
  private alertasService = inject(AlertasService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  alertas = this.alertasService.alertas;

  columnas = ['Tipo', 'Fecha', 'Cliente', 'Estado', 'Origen'];
  campos = ['tipo', 'fechaProgramada', 'clienteId', 'estado', 'origen'];
  acciones = ['ver', 'editar', 'eliminar'];

  fieldTypes = {
    fechaProgramada: 'datetime'
  };

  alertaSeleccionada: Alerta | null = null;
  alertaParaEliminar: Alerta | null = null;
  modoEdicion = false;
  formularioVisible = false;

  formFields: FieldMeta[] = camposAlerta;

  alertaForm = this.fb.group({
    ...generateFormGroup(this.fb, this.formFields).controls,
    id: this.fb.control(''),
    empresaId: this.fb.control('empresa1'),
    estado: this.fb.control('pendiente'),   
    origen: this.fb.control('manual'),      
  });

  manejarAccion(event: { action: string; row: Alerta }) {
    if (event.action === 'ver') {
      this.alertaSeleccionada = event.row;
    } else if (event.action === 'editar') {
      this.modoEdicion = true;
      this.alertaForm.setValue(mapRowToForm<Alerta>(event.row, this.alertaForm));
      this.formularioVisible = true;
    } else if (event.action === 'eliminar') {
      this.abrirConfirmacionEliminar(event.row);
    }
  }

  abrirFormulario() {
    this.modoEdicion = false;
    this.alertaForm.reset({
      empresaId: 'empresa1',
      estado: 'pendiente',
      origen: 'manual'
    });
    this.formularioVisible = true;
  }
  

  cerrarFormulario() {
    this.formularioVisible = false;
  }

  guardarFormulario() {
    const a = this.alertaForm.value as Alerta;

    if (this.modoEdicion) {
      this.alertasService.actualizarAlerta(a);
      this.toast.show('Alerta actualizada con éxito', 'success');
    } else {
      a.id = crypto.randomUUID();
      this.alertasService.agregarAlerta(a);
      this.toast.show('Alerta creada con éxito', 'success');
    }

    this.formularioVisible = false;
  }

  cerrarDetalle() {
    this.alertaSeleccionada = null;
  }

  abrirConfirmacionEliminar(a: Alerta) {
    this.alertaParaEliminar = a;
  }

  cancelarEliminacion() {
    this.alertaParaEliminar = null;
  }

  confirmarEliminacion() {
    this.alertasService.eliminarAlerta(this.alertaParaEliminar!.id!);
    this.toast.show('Alerta eliminada con éxito', 'success');
    this.alertaParaEliminar = null;
  }
}
