import { Component,inject,signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { fadeIn, scaleIn, staggerFadeSlideIn, fadeSlideRight } from '../../shared/animations';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

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
  
  get user() {
    return this.userService.usuario(); 
  }
  logout() {
    this.auth.logout();
  }
 }
