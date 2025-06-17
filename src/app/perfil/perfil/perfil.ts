import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
})
export class Perfil {
  private fb = inject(FormBuilder);
  private firestore = inject(Firestore);
  private userService = inject(UserService);
  private toast = inject(ToastService);
  private router = inject(Router);

  perfil = signal(this.userService.usuario());

  form = this.fb.group({
    nombre: [this.perfil()?.nombre ?? '', Validators.required],
    empresaId: [this.perfil()?.empresaId ?? '', Validators.required]
  });

  guardar() {
    const perfil = this.perfil();
    if (!perfil) return;

    const ref = doc(this.firestore, 'users', perfil.id);
    const data = this.form.value;

    updateDoc(ref, data).then(() => {
      this.toast.show('Perfil actualizado', 'success');
      this.userService.setUsuario({
        ...perfil,
        nombre: data.nombre ?? '',
        empresaId: data.empresaId ?? ''
      });
       // Actualizar local
      this.router.navigateByUrl('/dashboard'); // Redirigir tras guardar
    });
  }
}
