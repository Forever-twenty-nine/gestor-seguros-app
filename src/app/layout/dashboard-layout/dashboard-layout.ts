import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { fadeIn, scaleIn, staggerFadeSlideIn, fadeSlideRight } from '../../shared/animations';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { EmpresaService } from '../../services/empresa.service';


@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard-layout.html',
  animations: [fadeIn, scaleIn, staggerFadeSlideIn, fadeSlideRight]
})
export class DashboardLayout {
  private auth = inject(AuthService);
  private userService = inject(UserService);

  menuAbierto = false;

navLinks = [
  { label: 'Clientes', route: '/clientes' },
  { label: 'Pólizas', route: '/polizas' },
  { label: 'Siniestros', route: '/siniestros' },
  { label: 'Alertas', route: '/alertas' },
  { label: 'Aseguradoras', route: '/aseguradoras' },
  { label: 'Perfil', route: '/perfil' }
];

// Detecta si estamos en mobile
get screenIsMobile() {
  return window.innerWidth < 768;
}

cerrarMenuEnMovil() {
  if (this.screenIsMobile) this.menuAbierto = false;
}


  get user() {
    return this.userService.usuario();
  }
  logout() {
    this.auth.logout();
  }
}
