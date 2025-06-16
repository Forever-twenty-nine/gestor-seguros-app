import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Importamos los componentes necesarios
import { Table } from '../../components/ui/table/table';
import { TableForm } from '../../components/ui/table-form/table-form';
import { TableDetail } from '../../components/ui/table-detail/table-detail';
import { TableConfirm } from '../../components/ui/table-confirm/table-confirm';

import { Siniestro } from '../../models/siniestro.model';
import { SiniestrosService } from '../../services/siniestros.service';
import { ToastService } from '../../services/toast.service';
import { camposSiniestro, FieldMeta, generateFormGroup, mapRowToForm } from '../../utils/form-utils';

@Component({
  selector: 'app-siniestros',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Table, TableForm, TableDetail, TableConfirm],
  templateUrl: './siniestros.html',
})
export class Siniestros {
  private siniestrosService = inject(SiniestrosService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  siniestros = this.siniestrosService.siniestros;

  columnas = ['Fecha', 'Tipo', 'Estado'];
  campos = ['fecha', 'tipoSiniestro', 'estado'];
  acciones = ['ver', 'editar', 'eliminar'];

  fieldTypes = {
    fecha: 'datetime'
  };
  
  siniestroSeleccionado: Siniestro | null = null;
  siniestroParaEliminar: Siniestro | null = null;
  modoEdicion = false;
  formularioVisible = false;

  formFields: FieldMeta[] = camposSiniestro;

  siniestroForm = this.fb.group({
    ...generateFormGroup(this.fb, this.formFields).controls,
    id: this.fb.control(''),
    empresaId: this.fb.control('empresa1'),
  });

  manejarAccion(event: { action: string; row: Siniestro }) {
    if (event.action === 'ver') {
      this.siniestroSeleccionado = event.row;
    } else if (event.action === 'editar') {
      this.modoEdicion = true;
      this.siniestroForm.setValue(mapRowToForm<Siniestro>(event.row, this.siniestroForm));
      this.formularioVisible = true;
    } else if (event.action === 'eliminar') {
      this.abrirConfirmacionEliminar(event.row);
    }
  }

  abrirFormulario() {
    this.modoEdicion = false;
    this.siniestroForm.reset({ empresaId: 'empresa1' });
    this.formularioVisible = true;
  }

  cerrarFormulario() {
    this.formularioVisible = false;
  }

  guardarFormulario() {
    const s = this.siniestroForm.value as Siniestro;

    if (this.modoEdicion) {
      this.siniestrosService.actualizarSiniestro(s);
      this.toast.show('Siniestro actualizado con éxito', 'success');
    } else {
      s.id = crypto.randomUUID();
      this.siniestrosService.agregarSiniestro(s);
      this.toast.show('Siniestro creado con éxito', 'success');
    }

    this.formularioVisible = false;
  }

  cerrarDetalle() {
    this.siniestroSeleccionado = null;
  }

  abrirConfirmacionEliminar(s: Siniestro) {
    this.siniestroParaEliminar = s;
  }

  cancelarEliminacion() {
    this.siniestroParaEliminar = null;
  }

  confirmarEliminacion() {
    this.siniestrosService.eliminarSiniestro(this.siniestroParaEliminar!.id!);
    this.toast.show('Siniestro eliminado con éxito', 'success');
    this.siniestroParaEliminar = null;
  }
}
