import { Validators, FormBuilder, FormGroup } from '@angular/forms';
// Definición de los metadatos de los campos del formulario
export interface FieldMeta {
    name: string;
    label: string;
    type?: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea' | 'file' | 'checkbox' | 'radio' | 'password' | 'datetime' | 'time' | 'hidden';
    validators?: any[];
    options?: string[] | { label: string; value: string }[];
    placeholder?: string;
    readonly?: boolean;
}
// Podés usar esto directamente o copiar en el componente específico
export const camposCliente: FieldMeta[] = [
  {
    name: 'nombre',
    label: 'Nombre',
    type: 'text',
    validators: [
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]+$/)
    ]
  },
  {
    name: 'telefono',
    label: 'Teléfono',
    type: 'text',
    validators: [
      Validators.required,
      Validators.pattern(/^\+?\d{7,15}$/)
    ]
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    validators: [
      Validators.required,
      Validators.email,
      Validators.maxLength(100)
    ]
  },
  {
    name: 'direccion',
    label: 'Dirección',
    type: 'text',
    validators: [
      Validators.required,
      Validators.maxLength(100)
    ]
  },
  {
    name: 'dniCuit',
    label: 'DNI/CUIT',
    type: 'number',
    validators: [
      Validators.required,
      Validators.min(1000000),
      Validators.max(99999999999)
    ]
  },
  {
    name: 'empresaId',
    label: 'Empresa',
    type: 'hidden'
  }
];


// Campos para el formulario de póliza
export const camposPoliza: FieldMeta[] = [
    { name: 'clienteId', label: 'Cliente', type: 'select', validators: [Validators.required], readonly: true },
    { name: 'numero', label: 'Número de póliza', type: 'text', validators: [Validators.required] },
    { name: 'tipoSeguro', label: 'Tipo de seguro', type: 'text', validators: [Validators.required] },
    { name: 'empresaAseguradoraId', label: 'Aseguradora', type: 'text', validators: [Validators.required] },
    { name: 'fechaInicio', label: 'Fecha de inicio', type: 'date', placeholder: 'dd/mm/aaaa', validators: [Validators.required] },
    { name: 'fechaVencimiento', label: 'Fecha de fin', type: 'date', placeholder: 'dd/mm/aaaa', validators: [Validators.required] },
    { name: 'montoAsegurado', label: 'Monto asegurado', type: 'number', validators: [Validators.required] },
    { name: 'adjuntos', label: 'Adjuntos', type: 'text' }, // Podría ser un array de archivos
    { name: 'empresaId', label: 'Empresa', type: 'text', validators: [Validators.required] },
    { name: 'estado', label: 'Estado', type: 'text', validators: [Validators.required] }
];
// Campos para el formulario de siniestro
export const camposSiniestro: FieldMeta[] = [
    { name: 'clienteId', label: 'Cliente', type: 'select', validators: [Validators.required] },
    { name: 'polizaId', label: 'Póliza asociada', type: 'select', validators: [Validators.required] },
    { name: 'fecha', label: 'Fecha del siniestro', type: 'datetime', validators: [Validators.required] },
    { name: 'tipoSiniestro', label: 'Tipo de siniestro', type: 'text', validators: [Validators.required] },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', validators: [Validators.required] },
    { name: 'estado', label: 'Estado', type: 'select', options: ['reportado', 'en proceso', 'resuelto'], validators: [Validators.required] },
    { name: 'adjuntos', label: 'Adjuntos', type: 'file' },
    { name: 'empresaId', label: 'Empresa', type: 'hidden' }
];
// Campos para el formulario de alerta
export const camposAlerta: FieldMeta[] = [
    { name: 'tipo', label: 'Tipo de alerta', type: 'select', options: ['vencimiento', 'siniestro'], validators: [Validators.required] },
    { name: 'fechaProgramada', label: 'Fecha programada', type: 'datetime', validators: [Validators.required] },
    { name: 'clienteId', label: 'Cliente', type: 'select', validators: [Validators.required] },
    { name: 'polizaId', label: 'Póliza asociada', type: 'select' },
    { name: 'estado', label: 'Estado', type: 'select', options: ['pendiente', 'atendida'], validators: [Validators.required] },
    { name: 'origen', label: 'Origen', type: 'select', options: ['auto', 'manual'], validators: [Validators.required] },
    { name: 'empresaId', label: 'Empresa', type: 'hidden' }
];
// Campos para el formulario de Aseguradora

export const camposAseguradora: FieldMeta[] = [
  { name: 'nombre', label: 'Nombre', type: 'text', validators: [Validators.required] },
  { name: 'emailContacto', label: 'Email de contacto', type: 'email', validators: [Validators.required, Validators.email] },
  { name: 'telefono', label: 'Teléfono', type: 'text' },
  { name: 'direccion', label: 'Dirección', type: 'text' },
  { name: 'logoUrl', label: 'Logo URL', type: 'hidden' },
  { name: 'empresaId', label: 'Empresa', type: 'hidden' } 
];


// Función para generar FormGroup desde los metadatos
export function generateFormGroup(fb: FormBuilder, fields: FieldMeta[]): FormGroup {
    const group: any = {};
    for (const field of fields) {
        group[field.name] = fb.control('', field.validators || []);
    }
    return fb.group(group);
}
// Función para generar FormGroup desde los metadatos con valores iniciales
export function getLabelFromFields(fields: FieldMeta[], key: string): string {
    const found = fields.find(f => f.name === key);
    return found?.label ?? key;
}
// 🔁 De modelo → valores para setear en form
export function mapRowToForm<T = any>(row: Record<string, any>, form: FormGroup): { [K in keyof T]: any } {
    const result: any = {};

    for (const key of Object.keys(form.controls)) {
        const value = row[key];

        if (value instanceof Date) {
            result[key] = value.toISOString().slice(0, 16); // formato: 2025-06-17T14:30
        } else {
            result[key] = value ?? null;
        }
    }

    return result;
}
// 🔁 De form → modelo con fechas parseadas
export function mapFormToModel(form: FormGroup): Record<string, any> {
    const raw = form.getRawValue();
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(raw)) {
        if (
            typeof value === 'string' &&
            /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/.test(value)
        ) {
            result[key] = new Date(value);
        } else {
            result[key] = value;
        }
    }

    return result;
}
// Función para formatear fecha a string local
export function formatearFechaHoraLocal(fecha: Date | string): string {
    const d = new Date(fecha);
    return d.toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}