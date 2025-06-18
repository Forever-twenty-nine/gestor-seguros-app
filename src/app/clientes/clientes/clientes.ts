import { Component, computed, effect, inject, signal } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';
import { ToastService } from '../../services/toast.service';
import { Cliente } from '../../models/cliente.model';
import { Table } from '../../components/ui/table/table';
import { TableDetail } from '../../components/ui/table-detail/table-detail';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FieldMeta, camposCliente, generateFormGroup, mapRowToForm } from '../../utils/form-utils';
import { TableForm } from '../../components/ui/table-form/table-form';
import { CommonModule } from '@angular/common';
import { TableConfirm } from '../../components/ui/table-confirm/table-confirm';
import { PolizasService } from '../../services/polizas.service';
import { Poliza } from '../../models/poliza.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [Table, TableDetail, TableForm, CommonModule, ReactiveFormsModule, TableConfirm],
  templateUrl: './clientes.html'
})
export class Clientes {
  // 🧩 Inyecciones
  private clientesService = inject(ClientesService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private polizasService = inject(PolizasService);

  // 📄 Campos visibles en la tabla
  columnas = ['Nombre', 'Teléfono', 'Email'];
  campos = ['nombre', 'telefono', 'email'];
  acciones = ['ver', 'editar', 'eliminar'];

  // 🧠 Señales reactivas
  clientes = this.clientesService.clientes;
  clienteSeleccionado = signal<Cliente | null>(null);
  clienteParaEliminar = signal<Cliente | null>(null);
  polizasDelCliente = signal<Poliza[]>([]);
  modoEdicion = signal(false);
  formularioVisible = signal(false);

  // 🧾 Meta de formulario y grupo reactivo
  formFields: FieldMeta[] = camposCliente;
  clienteForm = this.fb.group({
    ...generateFormGroup(this.fb, this.formFields).controls,
    id: this.fb.control(''),
    empresaId: this.fb.control('')
  });

  // 🧮 Computado: texto del botón y título del formulario
  modoTexto = computed(() => this.modoEdicion() ? 'Editar Cliente' : 'Nuevo Cliente');

  // ⚡️ Efecto: cargar pólizas al seleccionar un cliente
  constructor() {
    effect(() => {
      const cliente = this.clienteSeleccionado();
      if (cliente) {
        const polizas = this.polizasService.getPolizasPorCliente(cliente.id!);
        this.polizasDelCliente.set(polizas);
      }
    });
  }

  // 📦 Manejador de acciones de tabla
  manejarAccion(event: { action: string; row: Cliente }) {
    if (event.action === 'ver') {
      this.clienteSeleccionado.set(event.row);
    } else if (event.action === 'editar') {
      this.modoEdicion.set(true);
      this.clienteForm.setValue(mapRowToForm<Cliente>(event.row, this.clienteForm));
      this.formularioVisible.set(true);
    } else if (event.action === 'eliminar') {
      this.abrirConfirmacionEliminar(event.row);
    }
  }

  // ➕ Abrir formulario para nuevo cliente
  abrirFormulario() {
    this.modoEdicion.set(false);
    this.clienteForm.reset(); // empresaId lo asigna el servicio
    this.formularioVisible.set(true);
  }

  // ❌ Cerrar formulario
  cerrarFormulario() {
    this.formularioVisible.set(false);
  }

  // 💾 Guardar o actualizar cliente
  async guardarFormulario() {
    const cliente = this.clienteForm.getRawValue() as Cliente;

    try {
      await this.clientesService.guardarCliente(cliente);
      this.toast.show(
        this.modoEdicion() ? 'Cliente actualizado con éxito' : 'Cliente creado con éxito',
        'success'
      );
      this.formularioVisible.set(false);
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      this.toast.show('Error al guardar el cliente', 'error');
    }
  }

  // 📌 Cerrar detalle de cliente
  cerrarDetalle() {
    this.clienteSeleccionado.set(null);
  }

  // 🗑 Confirmar eliminación
  abrirConfirmacionEliminar(cliente: Cliente) {
    this.clienteParaEliminar.set(cliente);
  }

  cancelarEliminacion() {
    this.clienteParaEliminar.set(null);
  }

  async confirmarEliminacion() {
    const cliente = this.clienteParaEliminar();
    if (!cliente) return;

    try {
      await this.clientesService.eliminarCliente(cliente.id!);
      this.toast.show('Cliente eliminado con éxito', 'success');
      this.clienteParaEliminar.set(null);
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      this.toast.show('Error al eliminar el cliente', 'error');
    }
  }

  // 📑 Manejador de acciones de pólizas asociadas
  manejarAccionPoliza(event: { action: string, row: Poliza }) {
    if (event.action === 'ver') {
      this.toast.show('Ver póliza ' + event.row.tipoSeguro, 'info');
    }
  }
}
