import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { EmpresaService } from '../../../services/empresa.service';
import { Empresa } from '../../../models/empresa.model';
import { ToastService } from '../../../services/toast.service';
import { Router } from '@angular/router';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-perfil-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-cuenta.html',
})
export class PerfilCuenta {
  private fb = inject(FormBuilder);
  private firestore = inject(Firestore);
  private userService = inject(UserService);
  private empresaService = inject(EmpresaService);
  private toast = inject(ToastService);
  private router = inject(Router);

  usuario = signal(this.userService.usuario());
  empresa = this.empresaService.empresa;
  cargando = signal(false);

  form = this.fb.group({
    nombreUsuario: [this.usuario()?.nombre ?? '', Validators.required],
    nombreEmpresa: [this.empresa()?.nombre ?? '', Validators.required],
    diasAnticipacion: [this.empresa()?.configAlertas.diasAnticipacion ?? 30, Validators.required],
    metodos: this.fb.group({
      email: [this.empresa()?.configAlertas.metodos.includes('email')],
      visual: [this.empresa()?.configAlertas.metodos.includes('visual')],
    }),
  });

  ngOnInit() {
    const e = this.empresa();
    if (e) {
      this.patchForm(e);
    } else {
      const user = this.usuario();
      if (user?.empresaId) {
        this.empresaService.cargarEmpresaDesdeFirestore(user.empresaId).then(() => {
          const nueva = this.empresa();
          if (nueva) this.patchForm(nueva);
        });
      }
    }
  }

  private patchForm(e: Empresa) {
    this.form.patchValue({
      nombreEmpresa: e.nombre,
      diasAnticipacion: e.configAlertas.diasAnticipacion,
      metodos: {
        email: e.configAlertas.metodos.includes('email'),
        visual: e.configAlertas.metodos.includes('visual'),
      },
    });
  }


  async guardarTodo() {
    const usuario = this.usuario();
    const empresa = this.empresa();

    if (!usuario || !empresa || this.form.invalid) return;

    this.cargando.set(true);
    const { nombreUsuario, nombreEmpresa, diasAnticipacion, metodos } = this.form.value;
    const metodosSeleccionados: ('email' | 'visual')[] = [];
    if (metodos?.email) metodosSeleccionados.push('email');
    if (metodos?.visual) metodosSeleccionados.push('visual');

    try {
      const empresaInicialSinNombre = !empresa.nombre?.trim();

      await updateDoc(doc(this.firestore, 'users', usuario.id), {
        nombre: nombreUsuario ?? '',
      });

      await updateDoc(doc(this.firestore, 'empresas', empresa.id), {
        nombre: nombreEmpresa ?? '',
        configAlertas: {
          diasAnticipacion: diasAnticipacion ?? 30,
          metodos: metodosSeleccionados,
        },
      });

      this.userService.setUsuario({ ...usuario, nombre: nombreUsuario ?? '' });
      await this.empresaService.cargarEmpresaDesdeFirestore(empresa.id); // refresca

      this.toast.show('Cuenta actualizada correctamente', 'success');

      // ✅ Redirigir solo si era primera vez
      if (empresaInicialSinNombre && nombreEmpresa?.trim()) {
        this.toast.show('Bienvenido/a, ¡tu cuenta está lista para comenzar!', 'success');
        setTimeout(() => {
          this.router.navigateByUrl('/dashboard');
        }, 1000); // da un segundo para ver el mensaje
      }

    } catch {
      this.toast.show('Hubo un error al guardar los datos', 'error');
    }

  }

  getUsuariosPermitidos() {
    const plan = this.empresa()?.plan;
    return plan === 'free' ? 1 : plan === 'basic' ? 3 : 5;
  }
}
