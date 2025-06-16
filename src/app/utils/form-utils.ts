import { Validators, FormBuilder, FormGroup } from '@angular/forms';

export interface FieldMeta {
    name: string;
    label: string;
    type?: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea';
    validators?: any[];
    placeholder?: string;
    readonly?: boolean; 
    
}

// Podés usar esto directamente o copiar en el componente específico
export const camposCliente: FieldMeta[] = [
    { name: 'nombre', label: 'Nombre', type: 'text', validators: [Validators.required] },
    { name: 'dniCuit', label: 'DNI/CUIT', type: 'number', validators: [Validators.required] },
    { name: 'telefono', label: 'Teléfono', type: 'text', validators: [Validators.required] },
    { name: 'email', label: 'Email', type: 'email', validators: [Validators.required, Validators.email] },
    { name: 'direccion', label: 'Dirección', type: 'text', validators: [Validators.required] },
];

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


// Función para generar FormGroup desde los metadatos
export function generateFormGroup(fb: FormBuilder, fields: FieldMeta[]): FormGroup {
    const group: any = {};
    for (const field of fields) {
        group[field.name] = fb.control('', field.validators || []);
    }
    return fb.group(group);
}

export function getLabelFromFields(fields: FieldMeta[], key: string): string {
    const found = fields.find(f => f.name === key);
    return found?.label ?? key;
}

// 🔁 De modelo → valores para setear en form
export function mapRowToForm<T = any>(row: Record<string, any>, form: FormGroup): { [K in keyof T]: any } {
    const result: any = {};

    for (const key of Object.keys(form.controls)) {
        const value = row[key];

        // Si es fecha, convertimos a string ISO corto
        if (value instanceof Date) {
            result[key] = value.toISOString().split('T')[0];
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
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            result[key] = new Date(value); // parse ISO string como Date
        } else {
            result[key] = value;
        }
    }

    return result;
  }
  
  