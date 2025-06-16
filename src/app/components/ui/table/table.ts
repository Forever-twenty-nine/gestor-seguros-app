import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatearFechaHoraLocal } from '../../../utils/form-utils';

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.html',
})

export class Table {

  /** Encabezados visibles en la tabla */
  @Input() headers: string[] = [];

  /** Claves de los datos a mostrar en cada fila */
  @Input() displayedColumns: string[] = [];

  /** Datos a mostrar (array de objetos) */
  private _rows = signal<any[]>([]);

  @Input()
  set rows(value: any[]) {
    this._rows.set([...value]); // fuerza nueva referencia en signal interno
  }

  get rows() {
    return this._rows();
  }

  @Input() fieldTypes: Record<string, string> = {}; // 👈 nuevo input

  formatValue(value: any, field: string): string {
    const tipo = this.fieldTypes[field];

    if (tipo === 'datetime') {
      return formatearFechaHoraLocal(value);
    }

    return value ?? '—';
  }

  /** Acciones habilitadas por fila: ['ver', 'editar', 'eliminar'] */
  @Input() actions: string[] = [];

  /** Tamaño de página para paginación */
  @Input() pageSize = 10;

  /** Habilita el input de búsqueda */
  @Input() enableSearch = true;

  /** Muestra botón “Nuevo” arriba */
  @Input() showNuevo = false;

  /** Texto del botón “Nuevo” */
  @Input() nuevoLabel = 'Nuevo registro';

  /** Al hacer click en el botón "Nuevo" */
  @Output() nuevoClick = new EventEmitter<void>();

  /** Cuando se ejecuta una acción sobre una fila */
  @Output() actionClick = new EventEmitter<{ action: string; row: any }>();

  /** Página actual */
  currentPage = signal(1);

  /** Valor de búsqueda */
  searchQuery = signal('');

  /** Total de páginas según resultados filtrados */
  totalPages = computed(() =>
    Math.ceil(this.filteredRows().length / this.pageSize)
  );

  /** Filtro de búsqueda aplicado sobre las filas */
  filteredRows = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const data = this._rows(); // ← usar signal interno

    if (!query) return data;

    return data.filter(row =>
      this.displayedColumns.some(col =>
        String(row[col] ?? '').toLowerCase().includes(query)
      )
    );
  });
  //** Clase CSS para el grid según columnas visibles */
  gridClass = computed(() => {
    const cols = this.displayedColumns.length + (this.actions.length > 0 ? 1 : 0);
    return {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8'
    }[cols] || 'grid-cols-1';
  });
  

  /** Fila visibles según página actual */
  paginatedRows = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredRows().slice(start, start + this.pageSize);
  });

  /** Cambiar página hacia adelante o atrás */
  changePage(delta: number) {
    const next = this.currentPage() + delta;
    if (next >= 1 && next <= this.totalPages()) {
      this.currentPage.set(next);
    }
  }

  /** Ejecutar acción desde botón en fila */
  onAction(action: string, row: any) {
    this.actionClick.emit({ action, row });
  }

  /** Emitir evento al presionar “Nuevo” */
  onNuevo() {
    this.nuevoClick.emit();
  }

  /** Actualizar búsqueda reactiva */
  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.currentPage.set(1); // volver a la primera página al buscar
  }
}
