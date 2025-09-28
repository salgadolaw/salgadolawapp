import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'dailyMessage-search-daily',
  imports: [MatInputModule, MatIconModule,MatButtonModule,MatFormFieldModule],
  templateUrl: './search-daily.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchDailyComponent {

  placeholder = input('Buscar...');
  searchInput = output<string>();

 }
