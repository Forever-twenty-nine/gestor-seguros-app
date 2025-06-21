import { Component, inject, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Poliza } from '../../models/poliza.model';
import { PolizasService } from '../../services/polizas.service';
import {
  FieldMeta,
  camposPoliza,
  generateFormGroup,
  mapRowToForm,
  mapFormToModel
} from '../../utils/form-utils';

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
  imports: [ReactiveFormsModule, Table, TableDetail, TableForm, TableConfirm],
  templateUrl: './polizas.html',
})
export class Polizas {
  // 🔧 Inyección de servicios
  private fb = inject(FormBuilder);
  private service = inject(PolizasService);
  private clientesService = inject(ClientesService);
  private toast = inject(ToastService);
  private aseguradorasService = inject(AseguradorasService);

  // 📝 Declaración de campos del formulario
  formFields: FieldMeta[] = camposPoliza;

  // 🧾 Formulario reactivo inicializado con los campos dinámicos
  form: FormGroup = this.fb.group({
    ...generateFormGroup(this.fb, this.formFields).controls,
    id: this.fb.control(''),
    clienteId: this.fb.control('cliente1'),
  });

  constructor() {
    // 👥 Cargar opciones para el campo clienteId desde el servicio
    const opcionesClientes = this.clientesService.clientes().map(c => ({
      label: c.nombre,
      value: c.id
    }));

    const clienteField = this.formFields.find(f => f.name === 'clienteId');
    if (clienteField) clienteField.options = opcionesClientes;
  }

  // 🎛️ Estados UI como signals reactivos
  modoEdicion = signal(false); // true si se está editando
  formularioVisible = signal(false); // true si está abierto el form
  polizaSeleccionada = signal<Poliza | null>(null); // para detalle
  polizaParaEliminar = signal<Poliza | null>(null); // para confirmación

  // 📋 Configuración estática para la tabla
  columnas = ['Número', 'Tipo', 'Aseguradora'];
  campos = ['numero', 'tipoSeguro', 'nombreAseguradora'];
  acciones = ['ver', 'editar', 'eliminar'];

  // 🏢 Mapa computado de aseguradoras (id → nombre)
  aseguradorasMap = computed(() => {
    return Object.fromEntries(
      this.aseguradorasService.aseguradoras().map(a => [a.id, a.nombre])
    );
  });

  // 📦 Lista de pólizas enriquecidas con nombre de aseguradora
  polizas = computed(() => {
    const aseguradoras = this.aseguradorasMap();
    return this.service.polizas().map(p => ({
      ...p,
      nombreAseguradora: aseguradoras[p.empresaAseguradoraId] ?? '—'
    }));
  });

  // 🔄 Maneja acciones emitidas desde la tabla (ver, editar, eliminar)
  manejarAccion(event: { action: string; row: Poliza }) {
    this.form.setValue(mapRowToForm(event.row, this.form));

    if (event.action === 'ver') {
      this.polizaSeleccionada.set(event.row);
    } else if (event.action === 'editar') {
      this.modoEdicion.set(true);
      this.formularioVisible.set(true);
    } else if (event.action === 'eliminar') {
      this.polizaParaEliminar.set(event.row);
    }
  }

  // ➕ Abre el formulario para crear una nueva póliza
  abrirFormulario() {
    this.modoEdicion.set(false);
    this.form.reset({ clienteId: 'cliente1' });
    this.formularioVisible.set(true);
  }

  // ❌ Cierra el formulario de creación/edición
  cerrarFormulario() {
    this.formularioVisible.set(false);
  }

  // 💾 Guarda la póliza (crear o actualizar) y muestra toast
  guardarFormulario() {
    const poliza = mapFormToModel(this.form) as Poliza;

    if (!this.modoEdicion()) {
      poliza.id = crypto.randomUUID(); // Nuevo ID si es nueva
    }

    this.service.guardarPoliza(poliza);
    this.toast.show('Póliza guardada con éxito', 'success');
    this.formularioVisible.set(false);
  }

  // 🔍 Cierra el modal de detalle
  cerrarDetalle() {
    this.polizaSeleccionada.set(null);
  }

  // 🔁 Cancela la acción de eliminar
  cancelarEliminacion() {
    this.polizaParaEliminar.set(null);
  }

  // 🗑️ Elimina la póliza seleccionada y notifica
  confirmarEliminacion() {
    const poliza = this.polizaParaEliminar();
    if (!poliza) return;

    this.service.eliminarPoliza(poliza.id!);
    this.toast.show('Póliza eliminada', 'success');
    this.polizaParaEliminar.set(null);
  }
}
