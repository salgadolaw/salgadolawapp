import { Component, inject, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DailyFormDialogComponent } from '../../dialogs/daily-form-dialog/daily-form-dialog.component';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-daily',
  imports: [MatIconModule,MatButtonModule],
  templateUrl: './new-daily.component.html',
})
export class NewDailyComponent {

  private dialog = inject(MatDialog);
  newCreation = output();

    newItemsDialogs() {
    const ref = this.dialog.open(DailyFormDialogComponent, { width: '700px',  maxWidth: '95vw',maxHeight:'95vh',  data: null });
    ref.afterClosed().subscribe(ok => ok && this.newCreation.emit());
  }

}
