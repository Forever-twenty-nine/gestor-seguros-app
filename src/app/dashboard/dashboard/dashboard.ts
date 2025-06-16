import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Servicios
import { PolizasService } from '../../services/polizas.service';
import { ClientesService } from '../../services/clientes.service';
import { AlertasService } from '../../services/alertas.service';
import { SiniestrosService } from '../../services/siniestros.service';
// Animaciones
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class Dashboard {
  private polizasService = inject(PolizasService);
  private clientesService = inject(ClientesService);
  private alertasService = inject(AlertasService);
  private siniestrosService = inject(SiniestrosService);

  polizas = this.polizasService.polizas;
  clientes = this.clientesService.clientes;
  alertas = this.alertasService.alertas;
  siniestros = this.siniestrosService.siniestros;

  // Resúmenes
  activas = computed(() => this.polizas().filter(p => p.estado === 'vigente').length);
  porVencer = computed(() => this.polizas().filter(p => p.estado === 'por vencer').length);
  vencidas = computed(() => this.polizas().filter(p => p.estado === 'vencida').length);

  // Clientes con alertas pendientes
  clientesConAlertas = computed(() => {
    const pendientes = this.alertas().filter(a => a.estado === 'pendiente');
    const clienteIds = [...new Set(pendientes.map(a => a.clienteId))];
    return this.clientes().filter(c => clienteIds.includes(c.id));
  });

  // Clientes con siniestros activos
  clientesConSiniestros = computed(() => {
    const activos = this.siniestros().filter(s => s.estado !== 'resuelto');
    const clienteIds = [...new Set(activos.map(s => s.clienteId))];
    return this.clientes().filter(c => clienteIds.includes(c.id));
  });
}
