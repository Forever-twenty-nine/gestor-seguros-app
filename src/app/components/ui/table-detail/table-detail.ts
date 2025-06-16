import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-detail',
  imports: [CommonModule],
  templateUrl: './table-detail.html'
})
export class TableDetail {
  @Input() item!: Record<string, any>;
  @Input() title: string = 'Detalle';
  @Output() cerrar = new EventEmitter<void>();

  get itemKeys(): string[] {
    return this.item ? Object.keys(this.item) : [];
  }
}
