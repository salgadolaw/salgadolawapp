import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { MatCard } from "@angular/material/card";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DailyServiceService } from '../../../services/dailyService.service';
import { LoadingComponent } from "../../../../../../../shared/components/loading/loading.component";


@Component({
  selector: 'clio-new-matter-contact',
  imports: [ReactiveFormsModule, CommonModule,
    MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule,
    MatDialogModule, MatSnackBarModule, MatSelectModule, MatProgressSpinnerModule, MatCard, LoadingComponent],
  templateUrl: './clio-newMatterContact.component.html',
})
export class ClioNewMatterContactComponent {

  private dialog = inject(MatDialogRef<ClioNewMatterContactComponent>);
  private dailyService = inject(DailyServiceService);
  private snack = inject(MatSnackBar);
  private fb = inject(FormBuilder);


  status = ['open', 'pending', 'closed'];
  senalFirstForm = input.required<boolean>();
  valueIdClient = input<number>();
  loading = signal(false);

  form = this.fb.group({
    description: ['', Validators.required],
    status: ['', Validators.required]
  })

  get f() { return this.form.controls; }

  constructor() {
    effect(() => {
      const idClients = this.valueIdClient();

    })
  }



  save() {
    //guardamos la informacion
    this.loading.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();


    const data = {

      client: { id: this.valueIdClient() },
      description: v.description,
      status: v.status,
      open_date: new Date(), // '2025-09-30'
    }

    this.dailyService.CreateMatterIdClientClio(data).subscribe(
      {
        next: (resp) => {
          this.loading.set(false);
          if (resp.id === 0) return;
          this.snack.open('Registros Guardados correctamente', '', { duration: 3000, verticalPosition: 'bottom', horizontalPosition: 'center', panelClass: ['snack-success'] });
          this.close();
        },
        error: (err) => {
          this.snack.open(`Se presento un error comuniquese con el Administrador ${err}`, 'OK', { duration: 3000, verticalPosition: 'bottom', horizontalPosition: 'center', panelClass: ['snack-error'] });
        }
      }
    )
  }

  close() {
    this.dialog.close();
  }

}
