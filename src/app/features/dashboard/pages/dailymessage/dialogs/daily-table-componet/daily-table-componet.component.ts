import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

type Row = {
  id: number;
  nombre: string;
  email: string;
  estado: 'Activo' | 'Inactivo';
};

@Component({
  selector: 'app-daily-table-componet',
  imports: [CommonModule, MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule,
    ReactiveFormsModule, MatButtonModule,
    MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './daily-table-componet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyTableComponetComponent {

displayedColumns = ['id', 'nombre', 'email', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Row>(crearFakerows(10)); // data ficticia
  search = new FormControl<string>('', { nonNullable: true });
  total = signal(this.dataSource.data.length);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // filtro por todas las columnas
    this.dataSource.filterPredicate = (row, filtro) => {
      const txt = `${row.id} ${row.nombre} ${row.email} ${row.estado}`.toLowerCase();
      return txt.includes(filtro.trim().toLowerCase());
    };

    this.search.valueChanges.subscribe(v => {
      this.dataSource.filter = v || '';
      // reinicia a página 0 para evitar páginas vacías
      this.paginator?.firstPage();
      this.total.set(this.dataSource.filteredData.length);
    });
  }



 }


 // --------- Data ficticia ----------
function crearFakerows(n: number): Row[] {
  const nombres = ['Andrés', 'Sofía', 'Carlos', 'María', 'Juan', 'Laura', 'Felipe', 'Valentina', 'Camilo', 'Diana'];
  return Array.from({ length: n }).map((_, i) => {
    const nombre = nombres[i % nombres.length] + ' ' + String.fromCharCode(65 + (i % 26)) + '.';
    return {
      id: i + 1,
      nombre,
      email: nombre.toLowerCase().replace(/\s+/g, '.') + '@example.com',
      estado: i % 3 === 0 ? 'Inactivo' : 'Activo'
    };
  });
}

