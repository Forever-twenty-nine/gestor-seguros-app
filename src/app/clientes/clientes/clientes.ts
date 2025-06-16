import { Component, inject } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';
import { ToastService } from '../../services/toast.service';
import { Cliente } from '../../models/cliente.model';
import { Table } from '../../components/ui/table/table';
import { TableDetail } from '../../components/ui/table-detail/table-detail';
// forms
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldMeta, camposCliente, generateFormGroup } from '../../utils/form-utils';

import { TableForm } from '../../components/ui/table-form/table-form';
import { CommonModule } from '@angular/common';
// table confirm
import { TableConfirm } from '../../components/ui/table-confirm/table-confirm';

@Component({
  selector: 'app-clientes',
  imports: [Table, TableDetail, TableForm, CommonModule, ReactiveFormsModule, TableConfirm],
  templateUrl: './clientes.html'
})
export class Clientes {

  private clientesService = inject(ClientesService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  clientes = this.clientesService.clientes;

  columnas = ['Nombre', 'Teléfono', 'Email'];
  campos = ['nombre', 'telefono', 'email'];
  acciones = ['ver', 'editar', 'eliminar'];

  clienteSeleccionado: Cliente | null = null;

  constructor() {
    this.clientesService.cargarMockData();
  }

  modoEdicion = false;

  formularioVisible = false;
  formFields: FieldMeta[] = camposCliente;

  clienteForm = this.fb.group({
    ...generateFormGroup(this.fb, this.formFields).controls,
    id: this.fb.control(''),
    empresaId: this.fb.control('empresa1'),
  });

  // Método para manejar las acciones de la tabla
  manejarAccion(event: { action: string; row: Cliente }) {
    if (event.action === 'ver') {
      this.clienteSeleccionado = event.row;
    } else if (event.action === 'editar') {
      this.modoEdicion = true;
      this.clienteForm.setValue({ ...event.row });
      this.formularioVisible = true;
    } else if (event.action === 'eliminar') {
      this.abrirConfirmacionEliminar(event.row);
    }

  }
  // Método para abrir el formulario en modo edición
  abrirFormulario() {
    this.modoEdicion = false;
    this.clienteForm.reset({ empresaId: 'empresa1' });
    this.formularioVisible = true;
  }

  // Método para cerrar el formulario
  cerrarFormulario() {
    this.formularioVisible = false;
  }
  // Método para guardar el formulario
  guardarFormulario() {
    const cliente = this.clienteForm.value as Cliente;
    if (this.modoEdicion) {
      this.clientesService.actualizarCliente(cliente);
      this.toast.show('Cliente actualizado con éxito', 'success');
    } else {
      cliente.id = crypto.randomUUID();
      this.clientesService.agregarCliente(cliente);
      this.toast.show('Cliente creado con éxito', 'success');
    }
    this.formularioVisible = false;
  }
  

  // Método para cerrar el detalle del cliente
  cerrarDetalle() {
    this.clienteSeleccionado = null;
  }

  clienteParaEliminar: Cliente | null = null;
  // Método para abrir la confirmación de eliminación
  abrirConfirmacionEliminar(cliente: Cliente) {
    this.clienteParaEliminar = cliente;
  }
  // Método para cancelar la eliminación del cliente
  cancelarEliminacion() {
    this.clienteParaEliminar = null;
  }
  // Método para confirmar la eliminación del cliente
  confirmarEliminacion() {
    this.clientesService.eliminarCliente(this.clienteParaEliminar!.id!);
    this.toast.show('Cliente eliminado con éxito', 'success');
    this.clienteParaEliminar = null;
  }
  

}


