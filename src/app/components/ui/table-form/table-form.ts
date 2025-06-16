import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldMeta } from '../../../utils/form-utils'; // ajustá el path según tu estructura

@Component({
  selector: 'app-table-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './table-form.html'
})
export class TableForm {
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
}
