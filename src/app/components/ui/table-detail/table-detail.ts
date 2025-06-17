import { Component, Input, Output, EventEmitter,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../../../services/clientes.service';
import { PolizasService } from '../../../services/polizas.service';
import { getLabelFromFields, camposCliente, camposPoliza,camposSiniestro,camposAlerta, camposAseguradora } from '../../../utils/form-utils';


@Component({
  selector: 'app-table-detail',
  imports: [CommonModule],
  templateUrl: './table-detail.html'
})
export class TableDetail {
  @Input() item!: Record<string, any>;
  @Input() title: string = 'Detalle';
  @Output() cerrar = new EventEmitter<void>();

  @Input() entity: 'cliente' | 'poliza' | 'siniestro' | 'alerta' | 'aseguradora' = 'cliente';


  private clientesService = inject(ClientesService);
  private polizasService = inject(PolizasService);


  get itemKeys(): string[] {
  if (!this.item) return [];

  const campos = {
    cliente: camposCliente,
    poliza: camposPoliza,
    siniestro: camposSiniestro,
    alerta: camposAlerta,
    aseguradora: camposAseguradora
  }[this.entity];

  return Object.keys(this.item).filter(k => {
    if (k === 'id') return false;
    const meta = campos?.find(f => f.name === k);
    return meta?.type !== 'hidden';
  });
}


  getValorFormateado(key: string, value: any): string {
    if (key === 'clienteId') {
      const nombre = this.clientesService.getClienteNombrePorId(value);
      return nombre || 'Sin cliente asignado';
    }

    if (key === 'polizaId') {
      const poliza = this.polizasService.getPolizaById?.(value); 
      return poliza ? (poliza.numero ?? poliza.tipoSeguro ?? poliza.id ?? 'Sin póliza') : 'Sin póliza';

    }

    if (value instanceof Date) {
      return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(value);
    }

    return value;
  }
  
  getLabel(key: string): string {
    switch (this.entity) {
      case 'cliente': return getLabelFromFields(camposCliente, key);
      case 'poliza': return getLabelFromFields(camposPoliza, key);
      case 'siniestro': return getLabelFromFields(camposSiniestro, key);
      case 'alerta': return getLabelFromFields(camposAlerta, key); 
      case 'aseguradora': return getLabelFromFields(camposAlerta, key); 
      default: return key;
    }
  }
   
}
