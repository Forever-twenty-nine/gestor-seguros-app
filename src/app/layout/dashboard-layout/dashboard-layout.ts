import { Component,inject,signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { fadeIn, scaleIn, staggerFadeSlideIn, fadeSlideRight } from '../../shared/animations';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: './dashboard-layout.html',
  animations: [fadeIn, scaleIn, staggerFadeSlideIn, fadeSlideRight]
})
export class DashboardLayout {
  private auth = inject(AuthService);
  private userService = inject(UserService);
  
  get user() {
    return this.userService.usuario(); // 👈 ahora sí es un valor
  }
  

  logout() {
    this.auth.logout();
  }
 }
