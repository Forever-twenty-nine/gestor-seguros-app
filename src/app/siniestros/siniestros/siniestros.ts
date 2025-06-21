import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Table } from '../../components/ui/table/table';
import { TableForm } from '../../components/ui/table-form/table-form';
import { TableDetail } from '../../components/ui/table-detail/table-detail';
import { TableConfirm } from '../../components/ui/table-confirm/table-confirm';
import { Siniestro } from '../../models/siniestro.model';
import { SiniestrosService } from '../../services/siniestros.service';
import { ToastService } from '../../services/toast.service';
import {
  camposSiniestro,
  FieldMeta,
  generateFormGroup,
  mapRowToForm,
  mapFormToModel
} from '../../utils/form-utils';

@Component({
  selector: 'app-siniestros',
  standalone: true,
  imports: [ReactiveFormsModule, Table, TableForm, TableDetail, TableConfirm],
  templateUrl: './siniestros.html',
})
export class Siniestros {
  // 🧩 Servicios
  private fb = inject(FormBuilder);
  private siniestrosService = inject(SiniestrosService);
  private toast = inject(ToastService);

  // 📋 Campos del formulario
  formFields: FieldMeta[] = camposSiniestro;

  // 📝 Formulario reactivo
  form: FormGroup = this.fb.group({
    ...generateFormGroup(this.fb, this.formFields).controls,
    id: this.fb.control(''),
    empresaId: this.fb.control('empresa1'),
  });

  // 🧠 Estado de UI con señales
  siniestroSeleccionado = signal<Siniestro | null>(null);
  siniestroParaEliminar = signal<Siniestro | null>(null);
  modoEdicion = signal(false);
  formularioVisible = signal(false);

  // 📦 Lista reactiva de siniestros desde el servicio
  siniestros = computed(() => this.siniestrosService.siniestros());

  // 🧩 Configuración de tabla
  columnas = ['Fecha', 'Tipo', 'Estado'];
  campos = ['fecha', 'tipoSiniestro', 'estado'];
  acciones = ['ver', 'editar', 'eliminar'];
  fieldTypes = {
    fecha: 'datetime'
  };

  // 📌 Acción desde la tabla: ver, editar o eliminar
  manejarAccion(event: { action: string; row: Siniestro }) {
    if (event.action === 'ver') {
      this.siniestroSeleccionado.set(event.row);
    } else if (event.action === 'editar') {
      this.modoEdicion.set(true);
      this.form.setValue(mapRowToForm<Siniestro>(event.row, this.form));
      this.formularioVisible.set(true);
    } else if (event.action === 'eliminar') {
      this.siniestroParaEliminar.set(event.row);
    }
  }

  // ➕ Abrir nuevo formulario vacío
  abrirFormulario() {
    this.modoEdicion.set(false);
    this.form.reset({ empresaId: 'empresa1' });
    this.formularioVisible.set(true);
  }

  // ❌ Cerrar modal de formulario
  cerrarFormulario() {
    this.formularioVisible.set(false);
  }

  // 💾 Guardar cambios o crear siniestro
  guardarFormulario() {
    const siniestro = mapFormToModel(this.form) as Siniestro;

    if (this.modoEdicion()) {
      this.siniestrosService.actualizarSiniestro(siniestro);
      this.toast.show('Siniestro actualizado con éxito', 'success');
    } else {
      siniestro.id = crypto.randomUUID();
      this.siniestrosService.agregarSiniestro(siniestro);
      this.toast.show('Siniestro creado con éxito', 'success');
    }

    this.formularioVisible.set(false);
  }

  // 🔍 Cerrar detalle
  cerrarDetalle() {
    this.siniestroSeleccionado.set(null);
  }

  // 🗑️ Cancelar eliminación
  cancelarEliminacion() {
    this.siniestroParaEliminar.set(null);
  }

  // ✅ Confirmar y ejecutar eliminación
  confirmarEliminacion() {
    const siniestro = this.siniestroParaEliminar();
    if (!siniestro) return;

    this.siniestrosService.eliminarSiniestro(siniestro.id!);
    this.toast.show('Siniestro eliminado con éxito', 'success');
    this.siniestroParaEliminar.set(null);
  }
}
