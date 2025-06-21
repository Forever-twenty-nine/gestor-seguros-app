import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Table } from '../../components/ui/table/table';
import { TableForm } from '../../components/ui/table-form/table-form';
import { TableDetail } from '../../components/ui/table-detail/table-detail';
import { TableConfirm } from '../../components/ui/table-confirm/table-confirm';

import { Alerta } from '../../models/alerta.model';
import { AlertasService } from '../../services/alertas.service';
import { ToastService } from '../../services/toast.service';
import {
  camposAlerta,
  FieldMeta,
  generateFormGroup,
  mapRowToForm,
  mapFormToModel,
} from '../../utils/form-utils';

@Component({
  selector: 'app-alertas',
  imports: [ReactiveFormsModule, Table, TableForm, TableDetail, TableConfirm],
  templateUrl: './alertas.html',
})
export class Alertas {
  // 🧩 Inyección de servicios
  private fb = inject(FormBuilder);
  private alertasService = inject(AlertasService);
  private toast = inject(ToastService);

  // 🧠 Estado UI con signals
  alertaSeleccionada = signal<Alerta | null>(null);
  alertaParaEliminar = signal<Alerta | null>(null);
  modoEdicion = signal(false);
  formularioVisible = signal(false);

  // 📋 Campos del formulario
  formFields: FieldMeta[] = camposAlerta;

  // 📝 Formulario reactivo
  form: FormGroup = this.fb.group({
    ...generateFormGroup(this.fb, this.formFields).controls,
    id: this.fb.control(''),
    empresaId: this.fb.control('empresa1'),
    estado: this.fb.control('pendiente'),
    origen: this.fb.control('manual'),
  });

  // 📦 Lista reactiva de alertas
  alertas = computed(() => this.alertasService.alertas());

  // 📊 Configuración de la tabla
  columnas = ['Tipo', 'Fecha', 'Cliente', 'Estado', 'Origen'];
  campos = ['tipo', 'fechaProgramada', 'clienteId', 'estado', 'origen'];
  acciones = ['ver', 'editar', 'eliminar'];
  fieldTypes = { fechaProgramada: 'datetime' };

  // 🔁 Manejo de acciones desde la tabla
  manejarAccion(event: { action: string; row: Alerta }) {
    if (event.action === 'ver') {
      this.alertaSeleccionada.set(event.row);
    } else if (event.action === 'editar') {
      this.modoEdicion.set(true);
      this.form.setValue(mapRowToForm(event.row, this.form));
      this.formularioVisible.set(true);
    } else if (event.action === 'eliminar') {
      this.alertaParaEliminar.set(event.row);
    }
  }

  // ➕ Abrir formulario limpio
  abrirFormulario() {
    this.modoEdicion.set(false);
    this.form.reset({
      empresaId: 'empresa1',
      estado: 'pendiente',
      origen: 'manual'
    });
    this.formularioVisible.set(true);
  }

  // ❌ Cerrar formulario
  cerrarFormulario() {
    this.formularioVisible.set(false);
  }

  // 💾 Guardar alerta nueva o editada
  guardarFormulario() {
    const alerta = mapFormToModel(this.form) as Alerta;

    if (this.modoEdicion()) {
      this.alertasService.actualizarAlerta(alerta);
      this.toast.show('Alerta actualizada con éxito', 'success');
    } else {
      alerta.id = crypto.randomUUID();
      this.alertasService.agregarAlerta(alerta);
      this.toast.show('Alerta creada con éxito', 'success');
    }

    this.formularioVisible.set(false);
  }

  // 🔍 Cerrar detalle
  cerrarDetalle() {
    this.alertaSeleccionada.set(null);
  }

  // ❌ Cancelar eliminación
  cancelarEliminacion() {
    this.alertaParaEliminar.set(null);
  }

  // ✅ Confirmar y eliminar alerta
  confirmarEliminacion() {
    const alerta = this.alertaParaEliminar();
    if (!alerta) return;

    this.alertasService.eliminarAlerta(alerta.id!);
    this.toast.show('Alerta eliminada con éxito', 'success');
    this.alertaParaEliminar.set(null);
  }
}
