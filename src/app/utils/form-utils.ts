import { Validators, FormBuilder, FormGroup } from '@angular/forms';

export interface FieldMeta {
    name: string;
    label: string;
    type?: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea';
    validators?: any[];
    placeholder?: string;
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
