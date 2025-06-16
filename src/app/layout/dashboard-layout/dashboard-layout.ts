import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { fadeIn, scaleIn, staggerFadeSlideIn, fadeSlideRight } from '../../shared/animations';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: './dashboard-layout.html',
  animations: [fadeIn, scaleIn, staggerFadeSlideIn, fadeSlideRight]
})
export class DashboardLayout { }
