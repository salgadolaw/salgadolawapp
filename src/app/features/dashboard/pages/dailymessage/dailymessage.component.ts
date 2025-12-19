
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
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingComponent } from "../../../../shared/components/loading/loading.component";






@Component({
  selector: 'app-dailymessage',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule,
    ReactiveFormsModule, MatButtonModule,
    SearchDailyComponent, DailyTableComponetComponent, MatToolbar, PanelRightComponent, DailyFormDialogComponent, LoadingComponent],
  templateUrl: './dailymessage.component.html',
  styleUrl: './dailymessage.component.scss'
})
export default class DailymessageComponent {
  private token = inject(TokenService);
  private dialog = inject(MatDialog);


  claims = computed(() => this.token.getClaims());
  dailyService = inject(DailyServiceService);
  loading_ = signal(false);
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
      this.loading_.set(true);
      return this.dailyService.getDailyMessage(params.email).pipe(
        finalize(() => this.loading_.set(false))
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

   const valueIdregist = Number(query);
    this.panelOpen = true;
    this.idRegistro.update(value => value = valueIdregist > 0 ? valueIdregist : -1);
    this.reloadKey++;
    this.loading_.set(false);

  }

   completeProcessDaily(query: string) {

    this.loading_.set(true);
     const ref = this.dialog.open(ConfirmDialogComponent, {
          width: '360px',
          data: { title: 'Completar Registro', message: `¿Está seguro de completar el registro?` }
        });
        ref.afterClosed().subscribe(ok => {

          if (!ok) return;
    //consumimos el servicio para completar el proceso
          this.dailyService.completeProcessDaily(Number(query)).pipe(
            finalize(() => this.loading_.set(false))
          ).subscribe(
            () => {
               this.panelOpen = false;
              this.loadDailyData.reload();
            }
          );

        });

   }



onDailySaved() {
  this.loadDailyData.reload();
  //ocultamos el panel una vez el hijo emita el evento de guardado
  this.panelOpen = false;
}



}













