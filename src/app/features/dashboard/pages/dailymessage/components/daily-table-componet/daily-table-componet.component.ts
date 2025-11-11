import { observable } from './../../../../../../../../node_modules/rxjs/src/internal/symbol/observable';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, Injector, input, output, signal, ViewChild, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DailyMessage } from '../../interfaces/dailyMessage';
import { DailyServiceService } from '../../services/dailyService.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClioNewClientMatterComponent } from '../../dialogs/clio-newClientMatter/clio-newClientMatter.component';
import { DailyFormDialogComponent } from '../../dialogs/daily-form-dialog/daily-form-dialog.component';
import { LoadingComponent } from '../../../../../../shared/components/loading/loading.component';




@Component({
  selector: 'app-daily-table-componet',
  imports: [CommonModule, MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule,
    ReactiveFormsModule, MatButtonModule,
    MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './daily-table-componet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyTableComponetComponent {

  dailyService = inject(DailyServiceService);
  private cdr = inject(ChangeDetectorRef);
  private injector = inject(Injector);
  private viewReady = signal(false);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['phone', 'caller', 'Categoria', 'Paralegal', 'Email Paralegal', 'Acciones'];

  data = input.required<DailyMessage[]>();
  total = signal(0);
  loading = signal(false);
  newCreation = signal('');


  dataSource = new MatTableDataSource<DailyMessage>([]);
  filterCtrl = new FormControl('', { nonNullable: true });
  query = input.required<string>();
  queryUpdate = output<string>();


  @ViewChild(MatTable) table!: MatTable<DailyMessage>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor() {

    this.dataSource.filterPredicate = (row, term) => {
      term = (term ?? '').trim().toLowerCase();
      return [
        row.pk_iddaily, row.phone, row.caller, row.v_namecategori, row.paralegal, row.mailparalegal, row.observation
      ].some(v => (v ?? '').toString().toLowerCase().includes(term));
    };

    this.dataSource.sortingDataAccessor = (row: DailyMessage, col: string) => {
      switch (col) {
        case 'categoria': return row.v_namecategori ?? '';
        case 'paralegal': return row.paralegal ?? '';
        case 'emailParalegal': return row.mailparalegal ?? '';
        default: return (row as any)?.[col] ?? '';
      }
    };

    effect(() => {
      if (!this.viewReady()) return;

      const rows = this.data() ?? [];
      const q = (this.query() ?? '').trim().toLowerCase();

      this.dataSource.data = rows;
      this.dataSource.filter = (this.query() ?? '').trim().toLowerCase();
      this.total.set(this.dataSource.filteredData.length);
      this.paginator.firstPage();
      this.dataSource._updateChangeSubscription();
      this.table?.renderRows();

    }, { injector: this.injector });


  }


  editRegist(idRegist: number) {
    const ref = this.dialog.open(DailyFormDialogComponent, { width: '700px', maxWidth: '95vw', maxHeight: '95vh', data: { idRegist: idRegist } });
    ref.afterClosed().subscribe((resp) => {
      if (resp?.ok) {
        this.queryUpdate.emit(resp?.ok);
      }
    });
  }

  completProcess(idresgist: number) {
    console.log(idresgist)
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.sort({ id: 'phone', start: 'asc', disableClear: false });
    this.viewReady.set(true);

  }





}


