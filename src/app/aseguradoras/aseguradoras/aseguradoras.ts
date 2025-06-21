import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Table } from '../../components/ui/table/table';
import { TableForm } from '../../components/ui/table-form/table-form';
import { TableDetail } from '../../components/ui/table-detail/table-detail';
import { TableConfirm } from '../../components/ui/table-confirm/table-confirm';
import { Aseguradora } from '../../models/aseguradora.model';
import { AseguradorasService } from '../../services/aseguradoras.service';
import { ToastService } from '../../services/toast.service';
import {
  camposAseguradora,
  FieldMeta,
  generateFormGroup,
  mapRowToForm,
  mapFormToModel
} from '../../utils/form-utils';

@Component({
  selector: 'app-aseguradoras',
  standalone: true,
  imports: [ReactiveFormsModule, Table, TableForm, TableDetail, TableConfirm],
  templateUrl: './aseguradoras.html',
})
export class Aseguradoras {
  // 🔧 Servicios
  private aseguradorasService = inject(AseguradorasService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  // 🧠 Estado UI con signals
  aseguradoraSeleccionada = signal<Aseguradora | null>(null);
  aseguradoraParaEliminar = signal<Aseguradora | null>(null);
  modoEdicion = signal(false);
  formularioVisible = signal(false);

  // 📋 Configuración de tabla
  columnas = ['Nombre', 'Email', 'Teléfono'];
  campos = ['nombre', 'emailContacto', 'telefono'];
  acciones = ['ver', 'editar', 'eliminar'];

  // 📦 Lista reactiva desde el servicio
  aseguradoras = computed(() => this.aseguradorasService.aseguradoras());

  // 📝 Formulario
  formFields: FieldMeta[] = camposAseguradora;
  form: FormGroup = this.fb.group({
    ...generateFormGroup(this.fb, this.formFields).controls,
    id: this.fb.control('')
  });

  // 📌 Acción desde tabla: ver, editar o eliminar
  manejarAccion(event: { action: string; row: Aseguradora }) {
    if (event.action === 'ver') {
      this.aseguradoraSeleccionada.set(event.row);
    } else if (event.action === 'editar') {
      this.modoEdicion.set(true);
      this.form.setValue(mapRowToForm<Aseguradora>(event.row, this.form));
      this.formularioVisible.set(true);
    } else if (event.action === 'eliminar') {
      this.aseguradoraParaEliminar.set(event.row);
    }
  }

  // ➕ Nuevo
  abrirFormulario() {
    this.modoEdicion.set(false);
    this.form.reset();
    this.formularioVisible.set(true);
  }

  // ❌ Cerrar
  cerrarFormulario() {
    this.formularioVisible.set(false);
  }

  // 💾 Guardar
  guardarFormulario() {
    const aseg = mapFormToModel(this.form) as Aseguradora;

    if (this.modoEdicion()) {
      this.aseguradorasService.actualizarAseguradora(aseg);
      this.toast.show('Aseguradora actualizada con éxito', 'success');
    } else {
      aseg.id = crypto.randomUUID();
      this.aseguradorasService.agregarAseguradora(aseg);
      this.toast.show('Aseguradora creada con éxito', 'success');
    }

    this.formularioVisible.set(false);
  }

  // 🔍 Cerrar detalle
  cerrarDetalle() {
    this.aseguradoraSeleccionada.set(null);
  }

  // 🗑️ Cancelar/Confirmar eliminación
  cancelarEliminacion() {
    this.aseguradoraParaEliminar.set(null);
  }

  confirmarEliminacion() {
    const aseg = this.aseguradoraParaEliminar();
    if (!aseg) return;

    this.aseguradorasService.eliminarAseguradora(aseg.id!);
    this.toast.show('Aseguradora eliminada con éxito', 'success');
    this.aseguradoraParaEliminar.set(null);
  }
}
