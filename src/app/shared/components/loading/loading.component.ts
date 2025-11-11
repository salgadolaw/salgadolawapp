import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-loading',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading.component.html',
})
export class LoadingComponent {

loading = input<boolean>();

}
