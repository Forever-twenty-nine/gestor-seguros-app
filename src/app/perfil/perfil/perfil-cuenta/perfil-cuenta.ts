import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';

import { UserService } from '../../../services/user.service';
import { EmpresaService } from '../../../services/empresa.service';
import { ToastService } from '../../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-cuenta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-cuenta.html',
})
export class PerfilCuenta {
  // 🧩 Servicios
  private fb = inject(FormBuilder);
  private firestore = inject(Firestore);
  private userService = inject(UserService);
  private empresaService = inject(EmpresaService);
  private toast = inject(ToastService);
  private router = inject(Router);

  // 👤 Datos del usuario actual
  readonly usuario = signal(this.userService.usuario());

  // 🏢 Empresa asociada (signal reactiva)
  readonly empresa = this.empresaService.empresa;

  // 🔄 Estados de UI
  readonly cargando = signal(false);
  readonly empresaCargada = computed(() => !!this.empresa());

  // 📝 Formulario reactivo para cuenta
  readonly form = this.fb.group({
    nombreUsuario: ['', [Validators.required, Validators.maxLength(50)]],
    nombreEmpresa: ['', [Validators.required, Validators.maxLength(50)]],
    diasAnticipacion: [30, [Validators.required, Validators.min(1), Validators.max(90)]],
    metodos: this.fb.group({
      email: [false],
      visual: [true],
    }),
  });

  constructor() {
    // 📥 Cargar empresa si no está
    effect(() => this.loadEmpresaIfNeeded());

    // 🔁 Sincronizar formulario con datos
    effect(() => this.syncFormWithEmpresa());
  }

  // 📦 Si falta empresa en memoria, cargarla desde Firestore
  private loadEmpresaIfNeeded() {
    const u = this.usuario();
    const e = this.empresa();

    if (u?.empresaId && !e) {
      this.empresaService.cargarEmpresaDesdeFirestore(u.empresaId);
    }
  }

  // 🔃 Actualizar formulario con datos actuales
  private syncFormWithEmpresa() {
    const u = this.usuario();
    const e = this.empresa();

    if (u && e) {
      this.form.patchValue({
        nombreUsuario: u.nombre,
        nombreEmpresa: e.nombre,
        diasAnticipacion: e.configAlertas?.diasAnticipacion ?? 30,
        metodos: {
          email: e.configAlertas?.metodos.includes('email'),
          visual: e.configAlertas?.metodos.includes('visual'),
        }
      });
    }
  }

  // 💾 Guardar todos los cambios
  async guardarTodo() {
    const u = this.usuario();
    const e = this.empresa();
    if (!u || !e || this.form.invalid) return;

    this.cargando.set(true);

    const { nombreUsuario, nombreEmpresa, diasAnticipacion, metodos } = this.form.value;

    const metodosSeleccionados: ('email' | 'visual')[] = [];
    if (metodos?.email) metodosSeleccionados.push('email');
    if (metodos?.visual) metodosSeleccionados.push('visual');

    try {
      const sinNombreInicial = !e.nombre?.trim();

      // 🔧 Actualizar nombre del usuario
      await updateDoc(doc(this.firestore, 'users', u.id), {
        nombre: nombreUsuario ?? '',
      });

      // 🏢 Actualizar configuración de la empresa
      await updateDoc(doc(this.firestore, 'empresas', e.id), {
        nombre: nombreEmpresa ?? '',
        configAlertas: {
          diasAnticipacion: diasAnticipacion ?? 30,
          metodos: metodosSeleccionados,
        },
      });

      // 🧠 Actualizar estado local del usuario
      this.userService.setUsuario({
        ...u,
        nombre: nombreUsuario ?? '',
        empresaNombre: nombreEmpresa ?? ''
      });

      // 🔄 Refrescar datos de empresa
      await this.empresaService.cargarEmpresaDesdeFirestore(e.id);
      this.toast.show('Cuenta actualizada correctamente', 'success');

      // 🚀 Bienvenida en primer uso
      if (sinNombreInicial && nombreEmpresa?.trim()) {
        this.toast.show('Bienvenido/a, ¡tu cuenta está lista para comenzar!', 'success');
        setTimeout(() => this.router.navigateByUrl('/dashboard'), 1000);
      }

    } catch {
      this.toast.show('Hubo un error al guardar los datos', 'error');
    } finally {
      this.cargando.set(false);
    }
  }

  // 👥 Usuarios permitidos por plan
  getUsuariosPermitidos() {
    const plan = this.empresa()?.plan;
    return plan === 'free' ? 1 : plan === 'basic' ? 3 : 5;
  }
}
