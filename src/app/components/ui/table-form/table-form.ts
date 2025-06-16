import { Component, EventEmitter, Input, Output,inject,signal,computed,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClientesService } from '../../../services/clientes.service';
import { AseguradorasService } from '../../../services/aseguradoras.service';
import { PolizasService } from '../../../services/polizas.service';
import { FieldMeta } from '../../../utils/form-utils'; 

@Component({
  selector: 'app-table-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './table-form.html'
})
export class TableForm implements OnInit {

  private clientesService = inject(ClientesService);
  private aseguradorasService = inject(AseguradorasService);
  private polizasService = inject(PolizasService);

  aseguradoras = this.aseguradorasService.aseguradoras;
  clientes = this.clientesService.clientes;
  polizas = this.polizasService.polizas;

  polizasFiltradas = signal<{ id: string; label: string }[]>([]);


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

  getValorMostrado(nombreCampo: string): string {
    const valor = this.form.get(nombreCampo)?.value;

    if (nombreCampo === 'clienteId') {
      return this.clientesService.getClienteNombrePorId(valor);
    }

    return valor ?? '';
  }
  ngOnInit(): void {
    const clienteIdControl = this.form.get('clienteId');

    if (clienteIdControl) {
      clienteIdControl.valueChanges.subscribe(clienteId => {
        if (clienteId) {
          const polizasAsociadas = this.polizasService.getPolizasPorCliente(clienteId);
          const opciones = polizasAsociadas.map(p => ({
            id: String(p.id),
            label: p.numero ?? p.tipoSeguro ?? '—'
          }));
          
          this.polizasFiltradas.set(opciones);
          this.form.get('polizaId')?.setValue(null);
        }
      });
    }
  }
  

}
