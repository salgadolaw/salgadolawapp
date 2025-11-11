
import { Component, ViewChild, AfterViewInit, signal, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { rxResource } from '@angular/core/rxjs-interop'

import { TokenService } from '../../../../core/services/token.service';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { SearchDailyComponent } from "./components/search-daily/search-daily.component";

import { NewDailyComponent } from "./components/new-daily/new-daily.component";
import { DailyTableComponetComponent } from "./components/daily-table-componet/daily-table-componet.component";
import { DailyServiceService } from './services/dailyService.service';
import { DailyMessage } from './interfaces/dailyMessage';
import { finalize, Observable, of } from 'rxjs';
import { MatToolbar } from "@angular/material/toolbar";
import { PanelRightComponent } from "../../../../shared/components/panel-right/panel-right.component";
import { DailyFormDialogComponent } from "./dialogs/daily-form-dialog/daily-form-dialog.component";






@Component({
  selector: 'app-dailymessage',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule,
    ReactiveFormsModule, MatButtonModule,
    SearchDailyComponent, NewDailyComponent, DailyTableComponetComponent, MatToolbar, PanelRightComponent, DailyFormDialogComponent],
  templateUrl: './dailymessage.component.html',
  styleUrl: './dailymessage.component.scss'
})
export default class DailymessageComponent {
  private token = inject(TokenService);
  private dialog = inject(MatDialog);


  claims = computed(() => this.token.getClaims());
  dailyService = inject(DailyServiceService);
  loading = signal(false);
  data = signal<DailyMessage[]>([]);
  total = signal(0);

  panelOpen = false;


  search = new FormControl<string>('', { nonNullable: true });
  idRegistro = signal<number>(0);
  query = signal('');
  newRegister = signal('');
  reloadKey = 0;

  email = computed(() => this.claims()?.email ?? '');



  loadDailyData = rxResource({
    params: () => ({ email: this.email() } as const),
    stream: ({ params }) => {
      if (!params.email) return of<DailyMessage[]>([]);
      this.loading.set(true);
      return this.dailyService.getDailyMessage(params.email).pipe(
        finalize(() => this.loading.set(false))
      );
    },
    defaultValue: [], // <- evita T | undefined
  });

  deilyResource(query: string) {
    this.query.set(query);
  }
  //validamos si se crea registro o se actualiza para que se recargue la información
  newCreationDaily(query: string) {
    //this.data;
    this.loadDailyData.reload();
    this.newRegister.set(query);

  }

  limpiarBusqueda() {
    this.search.setValue('');
  }

  NewCreationDailyPanel(query: string) {
    this.panelOpen = true;
    this.idRegistro.update(value => value = -1);
    this.reloadKey++;
  }







  /*loadDailyData():Observable<DailyMessage[]> | void {
  this.loading.set(true);
const email = this.claims()?.email ?? '';
if( !email ) {

   return this.dailyService.getDailyMessage(email).subscribe({
    next: (data) => {
      this.data.set(data);
      console.log(data);
      this.total.set(data.length);
      this.loading.set(false);
    },
    error: (error) => {
      console.error('Error fetching daily messages', error);
      this.loading.set(false);
    }
   })

  }
}*/






}













