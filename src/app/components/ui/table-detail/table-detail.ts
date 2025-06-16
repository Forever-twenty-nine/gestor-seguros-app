import { Component, Input, Output, EventEmitter,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../../../services/clientes.service';
import { getLabelFromFields, camposCliente, camposPoliza } from '../../../utils/form-utils';


@Component({
  selector: 'app-table-detail',
  imports: [CommonModule],
  templateUrl: './table-detail.html'
})
export class TableDetail {
  @Input() item!: Record<string, any>;
  @Input() title: string = 'Detalle';
  @Output() cerrar = new EventEmitter<void>();

  @Input() entity: 'cliente' | 'poliza' | 'siniestro' | 'alerta' = 'cliente';


  private clientesService = inject(ClientesService);

  get itemKeys(): string[] {
    return this.item ? Object.keys(this.item).filter(k => k !== 'id') : [];
  }

  getValorFormateado(key: string, value: any): string {
    if (key === 'clienteId') {
      const nombre = this.clientesService.getClienteNombrePorId(value);
      return nombre || 'Sin cliente asignado';
    }

    if (value instanceof Date) {
      return new Intl.DateTimeFormat('es-AR').format(value);
    }

    return value;
  }
  
  getLabel(key: string): string {
    if (this.entity === 'cliente') {
      return getLabelFromFields(camposCliente, key);
    } else if (this.entity === 'poliza') {
      return getLabelFromFields(camposPoliza, key);
    }
    return key;
  }
  
  
  
}
