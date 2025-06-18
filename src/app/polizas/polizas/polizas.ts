import { Component, inject, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Poliza } from '../../models/poliza.model';
import { PolizasService } from '../../services/polizas.service';
import {
  FieldMeta,
  camposPoliza,
  generateFormGroup,
  mapRowToForm,
  mapFormToModel
} from '../../utils/form-utils';

// 🧩 Componentes UI reutilizables
import { Table } from '../../components/ui/table/table';
import { TableDetail } from '../../components/ui/table-detail/table-detail';
import { TableForm } from '../../components/ui/table-form/table-form';
import { TableConfirm } from '../../components/ui/table-confirm/table-confirm';

import { ToastService } from '../../services/toast.service';
import { AseguradorasService } from '../../services/aseguradoras.service';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-polizas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Table, TableDetail, TableForm, TableConfirm],
  templateUrl: './polizas.html',
})
export class Polizas {
  private fb = inject(FormBuilder);
  private service = inject(PolizasService);
  private clientesService = inject(ClientesService);
  private toast = inject(ToastService);
  private aseguradorasService = inject(AseguradorasService);

  constructor() {
  const clientes = this.clientesService.clientes();
  const opcionesClientes = clientes.map(c => ({
    label: c.nombre,
    value: c.id
  }));

  // Buscamos el campo clienteId y le agregamos las opciones
  const clienteField = this.formFields.find(f => f.name === 'clienteId');
  if (clienteField) clienteField.options = opcionesClientes;
}

  // 🏢 Mapeamos ID → nombre de aseguradoras
  aseguradorasMap = computed(() => {
    return Object.fromEntries(
      this.aseguradorasService.aseguradoras().map(a => [a.id, a.nombre])
    );
  });

  // 📦 Pólizas con nombre de aseguradora incluído
  polizas = computed(() => {
    const aseguradoras = this.aseguradorasMap();

    return this.service.polizas().map(p => ({
      ...p,
      nombreAseguradora: aseguradoras[p.empresaAseguradoraId] ?? '—'
    }));
  });

  // 🧩 Configuración de tabla
  columnas = ['Número', 'Tipo', 'Aseguradora'];
  campos = ['numero', 'tipoSeguro', 'nombreAseguradora'];
  acciones = ['ver', 'editar', 'eliminar'];

  // 🎛️ Estado de UI
  modoEdicion = false;
  formularioVisible = false;
  polizaSeleccionada: Poliza | null = null;
  polizaParaEliminar: Poliza | null = null;

  // 📝 Formulario reactivo
  formFields: FieldMeta[] = camposPoliza;
  form: FormGroup = this.fb.group({
    ...generateFormGroup(this.fb, this.formFields).controls,
    id: this.fb.control(''),
    clienteId: this.fb.control('cliente1'),
  });

  // 📌 Acción desde tabla: ver, editar o eliminar
  manejarAccion(event: { action: string; row: Poliza }) {
    const valoresForm = mapRowToForm(event.row, this.form);
    this.form.setValue(valoresForm);

    if (event.action === 'ver') {
      this.polizaSeleccionada = event.row;

    } else if (event.action === 'editar') {
      this.modoEdicion = true;
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

  // 💾 Guardar póliza (crear o editar)
  guardarFormulario() {
    const poliza = mapFormToModel(this.form) as Poliza;

    if (!this.modoEdicion) {
      poliza.id = crypto.randomUUID(); // 🆕 Generar ID para nueva
    }

    this.service.guardarPoliza(poliza); // ✅ Firebase
    this.toast.show('Póliza guardada con éxito', 'success');
    this.formularioVisible = false;
  }

  cerrarDetalle() {
    this.polizaSeleccionada = null;
  }

  cancelarEliminacion() {
    this.polizaParaEliminar = null;
  }

  // 🗑️ Eliminar póliza de Firebase
  confirmarEliminacion() {
    this.service.eliminarPoliza(this.polizaParaEliminar!.id!);
    this.toast.show('Póliza eliminada', 'success');
    this.polizaParaEliminar = null;
  }
}
