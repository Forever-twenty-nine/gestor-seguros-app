import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Table } from '../../components/ui/table/table';
import { TableForm } from '../../components/ui/table-form/table-form';
import { TableDetail } from '../../components/ui/table-detail/table-detail';
import { TableConfirm } from '../../components/ui/table-confirm/table-confirm';

import { Aseguradora } from '../../models/aseguradora.model';
import { AseguradorasService } from '../../services/aseguradoras.service';
import { ToastService } from '../../services/toast.service';
import { camposAseguradora, FieldMeta, generateFormGroup, mapRowToForm } from '../../utils/form-utils';

@Component({
  selector: 'app-aseguradoras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Table, TableForm, TableDetail, TableConfirm],
  templateUrl: './aseguradoras.html',
})
export class Aseguradoras {
  private aseguradorasService = inject(AseguradorasService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  aseguradoras = this.aseguradorasService.aseguradoras;

  columnas = ['Nombre', 'Email', 'Teléfono'];
  campos = ['nombre', 'emailContacto', 'telefono'];
  acciones = ['ver', 'editar', 'eliminar'];

  aseguradoraSeleccionada: Aseguradora | null = null;
  aseguradoraParaEliminar: Aseguradora | null = null;
  modoEdicion = false;
  formularioVisible = false;

  formFields: FieldMeta[] = camposAseguradora;

  aseguradoraForm = this.fb.group({
    ...generateFormGroup(this.fb, this.formFields).controls,
    id: this.fb.control('')
  });

  manejarAccion(event: { action: string; row: Aseguradora }) {
    if (event.action === 'ver') {
      this.aseguradoraSeleccionada = event.row;
    } else if (event.action === 'editar') {
      this.modoEdicion = true;
      this.aseguradoraForm.setValue(mapRowToForm<Aseguradora>(event.row, this.aseguradoraForm));
      this.formularioVisible = true;
    } else if (event.action === 'eliminar') {
      this.abrirConfirmacionEliminar(event.row);
    }
  }

  abrirFormulario() {
    this.modoEdicion = false;
    this.aseguradoraForm.reset();
    this.formularioVisible = true;
  }

  cerrarFormulario() {
    this.formularioVisible = false;
  }

  guardarFormulario() {
    const aseg = this.aseguradoraForm.value as Aseguradora;

    if (this.modoEdicion) {
      this.aseguradorasService.actualizarAseguradora(aseg);
      this.toast.show('Aseguradora actualizada con éxito', 'success');
    } else {
      aseg.id = crypto.randomUUID();
      this.aseguradorasService.agregarAseguradora(aseg);
      this.toast.show('Aseguradora creada con éxito', 'success');
    }

    this.formularioVisible = false;
  }

  cerrarDetalle() {
    this.aseguradoraSeleccionada = null;
  }

  abrirConfirmacionEliminar(a: Aseguradora) {
    this.aseguradoraParaEliminar = a;
  }

  cancelarEliminacion() {
    this.aseguradoraParaEliminar = null;
  }

  confirmarEliminacion() {
    this.aseguradorasService.eliminarAseguradora(this.aseguradoraParaEliminar!.id!);
    this.toast.show('Aseguradora eliminada con éxito', 'success');
    this.aseguradoraParaEliminar = null;
  }
}
