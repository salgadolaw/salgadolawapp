import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, EventEmitter, inject, Input, OnInit, OnChanges, SimpleChanges, Output, signal, ViewChild, viewChild, effect } from '@angular/core';
import { FormBuilder, NgForm, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { DailyServiceService } from '../../services/dailyService.service';
import { Categories, ContactPhone, DailyMessage, MattersPhoneClio, PhoneContact } from '../../interfaces/dailyMessage';
import { finalize, map, of, single, switchMap, take, tap } from 'rxjs';
import { ClioNewClientMatterComponent } from '../clio-newClientMatter/clio-newClientMatter.component';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { LoadingComponent } from '../../../../../../shared/components/loading/loading.component';
import { _isNumberValue } from '@angular/cdk/coercion';
import { TokenService } from '../../../../../../core/services/token.service';
import { AutoFocus } from '../../../../../../shared/directives/auto-focus';
import { hasDashAndsParents } from '../../../../../../shared/Utils/string-validators';
import { MatToolbar } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ParalegalMatter } from '../../interfaces/paralegalMatter';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCard, MatCardHeader } from "@angular/material/card";
import { DailyListnotesComponent } from "../../components/daily-listnotes/daily-listnotes.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { NoteItem } from '../../interfaces/NotesResponse';



type DialogData = {
  idRegist: number;
}



@Component({
  selector: 'app-daily-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatPaginatorModule, MatSortModule,
    MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule,
    MatDialogModule, MatSnackBarModule, MatSelectModule, MatProgressSpinnerModule, LoadingComponent, MatToolbar, MatTooltipModule,
    MatExpansionModule, MatCard, MatCardHeader, DailyListnotesComponent],
  templateUrl: './daily-form-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyFormDialogComponent implements OnInit, OnChanges {


  private fb = inject(FormBuilder);
  //private ref = inject(MatDialogRef<DailyFormDialogComponent>);
  private dialog = inject(MatDialog);
  private token = inject(TokenService);
  private snack = inject(MatSnackBar);
  private dailyServices_ = inject(DailyServiceService);
  //data = inject<DialogData>(MAT_DIALOG_DATA);

  claims = computed(() => this.token.getClaims());
  dailyServices = inject(DailyServiceService);

  private ref = inject<MatDialogRef<DailyFormDialogComponent>>(MatDialogRef, {
    optional: true,
  });

  private dialogData = inject<DialogData | null>(MAT_DIALOG_DATA, {
    optional: true,
  });

  @Input() idRegist: number | null = null;
  @Input() reloadKey = 0;

  @Output() closed = new EventEmitter<{ ok: boolean }>();
  @Output() saved = new EventEmitter<DailyMessage>();

  @ViewChild('textPhone') textPhone!: ElementRef<HTMLInputElement>;

  showForm = true; // o signal si quieres



  showButton = signal(false);
  showButtonAdd = signal(false);

  contact: ContactPhone[] = [];
  callers: MattersPhoneClio[] = [];
  categorias: Categories[] = [];
  paralegals: ParalegalMatter[] = [];
  newCreation = signal('');
  loading = signal(false);
  tokenN8n = signal<string>('');
  idMatter = signal<string>('');
  query = signal('');
  states = [
    { 'id': 'Pendiente', 'name': 'Pendiente' },
    { 'id': 'Resuelto', 'name': 'Resuelto' }
  ]

  maxLeng = 10;

  form = this.fb.group({
    phone: this.fb.control('', { validators: [Validators.required, Validators.maxLength(this.maxLeng)] }),
    caller: [''],
    categoria: ['', Validators.required],
    paralegal: [''],
    emailParalegal: [''],//this.fb.control('valor-inicial'),
    resuelto: this.fb.control('', { validators: [Validators.required] }),
    observacion: this.fb.control('', { validators: [Validators.required] }),
    contact: this.fb.control('', { validators: [Validators.required] })
  });

  constructor() {

  }


  ngOnInit(): void {
    this.loadCategories();
    this.getDataIdDaily();
    this.resetFormForNew();


  }

  ngOnChanges(changes: SimpleChanges): void {

    if ('reloadKey' in changes) {
      this.resetFormForNew();
    }
  }



  private resetFormForNew(): void {
    const id_registro = this.currentId;
    if (id_registro === -1) {

      this.form.reset();
      this.callers = [];
      this.contact = [];
      this.showButton.set(false);
      this.showButtonAdd.set(false);
      this.newCreation.set('');

    }

  }

  private get currentId(): number {
    if (this.dialogData?.idRegist != null) return this.dialogData.idRegist;
    if (this.idRegist != null) return this.idRegist;
    return 0;
  }


  toggleForm() {
    this.showForm = !this.showForm;
  }

  getDataIdDaily() {
    this.loading.set(true);
    const id_registro = this.currentId;
    if (id_registro < 0) return;

    //cargamos la información que se va actualizar
    this.dailyServices.getDailyUpdate(id_registro)
      .subscribe({
        next: (data_) => {
          this.loading.set(false);
          if (Array.isArray(data_) && data_.length === 0) return;
          this.form.patchValue(Array.isArray(data_) ? data_[0] : data_);
          const item = Array.isArray(data_) ? data_[0] : data_;

          const clio: string | undefined = item?.IdContact;
          //this.callers = [{ id: Number(clio), display_number: item?.caller }];

          const match = this.callers.find(c => c.name === item?.caller);
          if (match) {

            this.form.get('caller')!.setValue(match.id.toString());
            this.form.get('emailParalegal')!.setValue(item?.mailparalegal);
            this.form.get('categoria')!.setValue(item?.fk_idcategoria);
            this.form.get('resuelto')!.setValue(item?.v_namestate);
            this.form.get('observacion')!.setValue(item?.observation);
          }
          // this.changeCaller(clio);
        },
        error: (err) => {

        }
      });
  }


  get f() { return this.form.controls; }


  save() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.currentId === -1) {
      this.saveNewRegist();
    } else if (this.currentId > 0) {
      this.saveUpdate(this.currentId);
    }

  }


  private buildBody(id?: number): DailyMessage {
    const callerId = this.form.get('caller')?.value;
    const callerName = this.callers.find(c => c.display_number === callerId)?.name;
    const stateId = this.form.controls.resuelto.value;
    const nameState = this.states.find(x => x.id === stateId)?.name ?? '';
    const contactId = this.form.get('contact')?.value;
    const contactName = this.contact.find(c => c.id === Number(contactId))?.name ?? '';

    return {
      phone: this.form.get('phone')?.value ?? '',
      caller: this.form.get('caller')?.value ?? '',
      clio: callerName ?? '',
      fk_idcategoria: this.form.get('categoria')?.value ?? '',
      paralegal: this.form.get('paralegal')?.value ?? '',
      mailparalegal: this.form.controls.emailParalegal.value ?? '',
      v_namestate: nameState,
      observation: this.form.get('observacion')?.value ?? '',
      v_namecategori: '',
      pk_iddaily: id ? id.toString() : '',
      dateregister: new Date(),
      email: this.claims()?.email ?? '',
      fk_iduser: '',
      fk_states: '',
      username: '',
      IdContact: contactId?.toString() ?? '',
      contact: contactName
    };
  }

  saveNewRegist() {
    const body = this.buildBody();

    console.log(body);
    this.saveUpdateData(body);

  }

  saveUpdate(idupdate: number) {

    const body = this.buildBody(idupdate);
    this.saveUpdateData(body);

  }

  saveUpdateData(deploy: DailyMessage) {
    this.loading.set(true);
    return this.dailyServices.postRegisterDaily(deploy).subscribe({
      next: (data) => {

        if (deploy.pk_iddaily === '') {
          this.snack.open('Registros Guardados correctamente', '', { duration: 3000, verticalPosition: 'bottom', horizontalPosition: 'center', panelClass: ['snack-success'] });
        } else {
          this.snack.open('Registros actualizados correctamente', 'OK', { duration: 3000, verticalPosition: 'bottom', horizontalPosition: 'center', panelClass: ['snack-success'] });
        }

        this.loading.set(false);
        this.close();
      },
      error: (err) => {
        this.snack.open('Se presento un error comuniquese con el Administrador', 'OK', { duration: 3000, verticalPosition: 'bottom', horizontalPosition: 'center', panelClass: ['snack-error'] });
      }
    });
  }


  close() {
    if (this.ref) {
      this.ref.close({ ok: true });
    } else {
      this.closed.emit({ ok: true });
    }
  }

  loadCategories() {
    this.dailyServices.getDailyCategories().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {

        this.snack.open('Se presento un error comuniquese con el Administrador', 'OK', { duration: 3000, verticalPosition: 'bottom', horizontalPosition: 'center', panelClass: ['snack-error'] });

      }
    });
  }


  loadContacts(phone: string) {

    console.log(phone)
    this.loading.set(true);
    this.showButton.set(false);
    this.dailyServices.getDailyContacts(phone).subscribe({
      next: (data) => {
        this.loading.set(false);
        // si viene como { result: [...] }
        if (Array.isArray((data as any).result)) {
          this.contact = (data as any).result;
        }
        // si alguna vez viene como array directo
        else if (Array.isArray(data)) {
          this.contact = data as any[];
        }
        else {
          this.contact = [];
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.showButton.set(true);
        this.resetForminputs();
        this.contact = [];
        this.snack.open('El número buscado no se encuentra', 'OK', { duration: 3000, verticalPosition: 'bottom', horizontalPosition: 'center', panelClass: ['snack-error'] });

        //console.error('Error loading contacts', err.statusText);
      }
    });
  }

  loadCallers(idClient: string) {
    const lengthValue = idClient.length;

    this.setMax(lengthValue);

    this.loading.set(true);
    this.showButton.set(false);
    this.dailyServices.getDailyCallers(idClient).subscribe({
      next: (data) => {

        //this.loading.set(false);
        if (data.length > 0) {
          this.showButtonAdd.set(true);
        }

        if (Array.isArray((data as any).result)) {
          this.callers = (data as any).result;
        }
        // si alguna vez viene como array directo
        else if (Array.isArray(data)) {
          this.callers = data as any[];
        }
        else {
          this.callers = [];
        }

        this.loading.set(false);

      },
      error: (err) => {
        this.loading.set(false);
        this.resetForminputs();
        this.callers = [];
        this.snack.open('El Matter buscado no se encuentra', 'OK', { duration: 3000, verticalPosition: 'bottom', horizontalPosition: 'center', panelClass: ['snack-error'] });

        // console.error('Error loading callers', err);
      }
    });
  }

  resetForminputs() {
    this.form.get('paralegal')?.reset();
    this.form.get('emailParalegal')?.reset();

  }

  changePhone(event: string) {
    this.loadContacts(event);
    //
  }


  changeContact(event: string) {
    this.loadCallers(event);
  }


  changeCaller(event: MatSelectChange) {
    this.loading.set(true);

    const value = typeof event === 'string' ? event : event.value;


    this.dailyServices.webhookToken().pipe(
      map(r => r.token),
      tap(t => this.tokenN8n.set(t)),                    // opcional: guardas el token
      switchMap(token => this.dailyServices.getParalegalDaily(value, token)),
      take(1),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (data) => {

        if (Array.isArray((data as any).result)) {
          this.paralegals = (data as any).result;
        }
        // si alguna vez viene como array directo
        else if (Array.isArray(data)) {
          this.paralegals = data as any[];
        }
        else {
          this.paralegals = [];
        }

        // buscamos el objeto que trae mailDrop (como tu ejemplo)
        const mailDropItem = this.paralegals.find(p => !!p.mailDrop);
        const mailDrop = mailDropItem?.mailDrop ?? '';

        // set al hidden
        this.form.get('emailParalegal')?.setValue(mailDrop.toString());

        // si también quieres mostrarlo en emailParalegal:
        if (mailDrop) {
          this.form.get('emailParalegal')?.setValue(mailDrop);
        }

        if (this.paralegals.length > 0) {
          //ejecutar las notas que estan asociadas al matter
          this.idMatter.set(String(value));
          //this.getListNotesMatters.reload();
        }


      },
      error: (err) => console.error('Error changeCaller:', err),
    });
  }


  getListNotesMatters = rxResource<NoteItem[], { idMatter: string | null }>({
    params: () => ({
      idMatter: this.idMatter(), // tu signal o lo que uses
    }),

    stream: ({ params }) => {
      const raw = params.idMatter;
      const id = raw ? Number(raw) : null;

      if (!id) {
        return of<NoteItem[]>([]);
      }

      this.loading.set(true);

      return this.dailyServices_
        .getDailyNotesMatter(id.toString()) // Observable<NotesResponse>
        .pipe(
          map(res => res.data ?? []),              // ahora Observable<NoteItem[]>
          finalize(() => this.loading.set(false))
        );
    },

    defaultValue: [], // NoteItem[]
  });

  newClioDialogs(item: string) {

    const ref = this.dialog.open(ClioNewClientMatterComponent, { width: '700px', maxWidth: '95vw', maxHeight: '95vh', data: { phone: item } });
    ref.afterClosed().subscribe(ok => ok && this.newCreation.set('ok'));
  }

  setMax(len: number) {

    this.maxLeng = len;

    const c = this.form.get('phone');
    c?.setValidators([Validators.required, Validators.maxLength(len)]);
    c?.updateValueAndValidity({ onlySelf: true });

  }




}
