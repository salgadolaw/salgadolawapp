import { Component, ViewChild, AfterViewInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { TokenService } from '../../../../core/services/token.service';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { SearchDailyComponent } from "./components/search-daily/search-daily.component";

import { NewDailyComponent } from "./components/new-daily/new-daily.component";
import { DailyTableComponetComponent } from "./dialogs/daily-table-componet/daily-table-componet.component";





@Component({
  selector: 'app-dailymessage',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatInputModule,
    ReactiveFormsModule, MatButtonModule,
    SearchDailyComponent, NewDailyComponent, DailyTableComponetComponent],
  templateUrl: './dailymessage.component.html',
  styleUrl: './dailymessage.component.scss'
})
export default class DailymessageComponent {
  private token = inject(TokenService);
  claims = computed(() => this.token.getClaims());


  private dialog = inject(MatDialog);
  search = new FormControl<string>('', { nonNullable: true });

   query = signal('');


  deilyResource(query: string){
    console.log(  query )
  }



   limpiarBusqueda() {
    this.search.setValue('');
  }

}













