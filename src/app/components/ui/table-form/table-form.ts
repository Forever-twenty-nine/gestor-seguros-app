import { Component, EventEmitter, Input, Output,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClientesService } from '../../../services/clientes.service';
import { AseguradorasService } from '../../../services/aseguradoras.service';
import { FieldMeta } from '../../../utils/form-utils'; 

@Component({
  selector: 'app-table-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './table-form.html'
})
export class TableForm {

  private clientesService = inject(ClientesService);
  private aseguradorasService = inject(AseguradorasService);


  @Input() title: string = 'Formulario';
  @Input() showGuardar = true;
  @Input() showCancelar = true;
  @Input() textGuardar = 'Guardar';
  @Input() textCancelar = 'Cancelar';
  @Input() disableGuardar = false;

  @Input() form!: FormGroup;
  @Input() fields: FieldMeta[] = [];

  @Output() guardar = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  aseguradoras = this.aseguradorasService.aseguradoras;


  getValorMostrado(nombreCampo: string): string {
    const valor = this.form.get(nombreCampo)?.value;

    if (nombreCampo === 'clienteId') {
      return this.clientesService.getClienteNombrePorId(valor);
    }

    return valor ?? '';
  }
}
