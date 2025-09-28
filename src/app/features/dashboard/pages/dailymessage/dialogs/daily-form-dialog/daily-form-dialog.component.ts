import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';




@Component({
  selector: 'app-daily-form-dialog',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule,
    MatDialogModule, MatSnackBarModule],
  templateUrl: './daily-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyFormDialogComponent { }
