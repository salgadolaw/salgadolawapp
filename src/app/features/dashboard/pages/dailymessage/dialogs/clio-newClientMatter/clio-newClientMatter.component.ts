import { ReactiveFormsModule } from '@angular/forms';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogActions, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard, MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { ClioNewMatterContactComponent } from "./clio-newMatterContact/clio-newMatterContact.component";
import { LoadingComponent } from "../../../../../../shared/components/loading/loading.component";
import { DailyServiceService } from '../../services/dailyService.service';
import { Subscription, Observable } from 'rxjs';

type DialogData = {
  phone: string;
}

@Component({
  selector: 'app-clio-new-client-matter',
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatButtonModule, MatSelectModule, MatCard, ClioNewMatterContactComponent, LoadingComponent, MatCardModule],
  templateUrl: './clio-newClientMatter.component.html',
})
export class ClioNewClientMatterComponent implements OnInit {

  private ref = inject(MatDialogRef<ClioNewClientMatterComponent>);

  private dailyServices = inject(DailyServiceService)
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  loading = signal(false);
  accesFormOne = signal(false);
  accesFormTwo = signal(false);
  valueIdClient_ = signal(0);
  //recibimos el valor enviado en la data del dialog para manejo
  data = inject<DialogData>(MAT_DIALOG_DATA);


  emailTypes = ['Work', 'Home', 'Other'];
  phoneTypes = ['Work', 'Home', 'Other'];




  form = this.fb.group({
    type: this.fb.control<'Person' | 'Company'>('Person', { nonNullable: true }),
    first_name: this.fb.control('', { validators: [Validators.required] }),
    last_name: this.fb.control('', { validators: [Validators.required] }),
    email_name: this.fb.control('Work', { nonNullable: true }),
    email: this.fb.control('', { validators: [Validators.required, Validators.email] }),
    phone_name: this.fb.control('Work', { nonNullable: true }),
    phone: this.fb.control('', { validators: [Validators.required] }),
  });

  ngOnInit(): void {

    this.validContactMatter();
  }

  //validamos si el telefono consultado no tienen matter asociados
  validContactMatter() {

    this.loading.set(true);
    if (this.data.phone === '') return;

    this.dailyServices.getvalidationMatterClient(this.data.phone).subscribe({
      next: (resp) => {

        if (resp.records >= 0) {
          this.loading.set(false);
          this.accesFormTwo.set(true);
          this.accesFormOne.set(false);
          this.valueIdClient_.set(resp.idClient);

        }
        if (resp.records === -1) {
          this.loading.set(false);
          this.accesFormOne.set(true);
          this.accesFormTwo.set(false);
        }

      },
      error: (err) => {
        this.loading.set(false);
        this.accesFormOne.set(true);
        this.accesFormTwo.set(false);
        console.log('Se presenta un inconveniente', err);

      }
    })

  }



  send() {
    this.loading.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    const data = {

        type: v.type,
        first_name: v.first_name,
        last_name: v.last_name,
        email_addresses: [{
          name: v.email_name,
          address: v.email,
          default_email: true
        }],
        phone_numbers: [{
          name: v.phone_name,
          number: v.phone,
          default_phone: true
        }]

    }

    this.dailyServices.CreateContactClio(data).subscribe({
      next: (data) => {
        if (data.id === 0) return;

        this.loading.set(false);
        this.accesFormTwo.set(true);
        this.accesFormOne.set(false);
        this.valueIdClient_.set(data.id);
        this.snack.open('Registros Guardados correctamente', '', { duration: 3000, verticalPosition: 'bottom', horizontalPosition: 'center', panelClass: ['snack-success'] });

      },
      error: (err) => {
        this.snack.open(`Se presento un error comuniquese con el Administrador ${err}`, 'OK', { duration: 3000, verticalPosition: 'bottom', horizontalPosition: 'center', panelClass: ['snack-error'] });

      }
    });


  }

  close() {
    this.ref.close();
  }



}
