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
  private empresaService = inject(EmpresaService);

  empresaIncompleta = computed(() => {
    const empresa = this.empresaService.empresa();
    const user = this.userService.usuario();
    return user?.rol === 'admin' && (!empresa?.nombre || empresa.nombre.trim() === '');
  });

  get user() {
    return this.userService.usuario();
  }
  logout() {
    this.auth.logout();
  }
}
