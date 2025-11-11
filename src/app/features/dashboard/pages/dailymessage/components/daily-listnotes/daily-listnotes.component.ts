import { Component, effect, inject, Injector, input, signal, ViewChild } from '@angular/core';
import { NoteItem, NotesResponse } from '../../interfaces/NotesResponse';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-daily-listnotes',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './daily-listnotes.component.html',
})
export class DailyListnotesComponent {


  private viewReady = signal(false);
  private injector = inject(Injector);

  displayedColumns: string[] = ['subject', 'detail'];

  data = input.required<NoteItem[]>();
  total = signal(0);
  loading = signal(false);
  query = input.required<string>();

  dataSource = new MatTableDataSource<NoteItem>([]);
  filterCtrl = new FormControl('', { nonNullable: true });


  @ViewChild(MatTable) table!: MatTable<NoteItem>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor() {

    this.dataSource.filterPredicate = (row, term) => {
      term = (term ?? '').trim().toLowerCase();
      return [
        row.detail, row.subject
      ].some(v => (v ?? '').toString().toLowerCase().includes(term));
    };

    this.dataSource.sortingDataAccessor = (row: NoteItem, col: string) => {
      switch (col) {
        case 'subject': return row.detail ?? '';
        case 'detail': return row.subject ?? '';
        default: return (row as any)?.[col] ?? '';
      }
    };

    effect(() => {
      if (!this.viewReady()) return;

      const rows = this.data() ?? [];

      const term = (this.query() ?? '').trim().toLowerCase();

      this.dataSource.data = rows;
      this.dataSource.filter = term;
      this.total.set(this.dataSource.filteredData.length);

      this.paginator.firstPage();
      this.table?.renderRows();
    }, { injector: this.injector });


  }


  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
      this.sort.sort({ id: 'subject', start: 'asc', disableClear: false });
    }
    this.viewReady.set(true);

  }



}
