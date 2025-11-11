import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import { Categories, ContactPhone, DailyMessage, MattersPhoneClio, Paralegal, TokenN8N } from '../interfaces/dailyMessage';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { ContactMapper } from '../mapper/ContactPhone.mapper';
import { ClientCreate, DetailsContact } from '../interfaces/contact';
import { MatterCreate } from '../interfaces/matters';
import { NoteItem, NotesResponse } from '../interfaces/NotesResponse';

@Injectable({
  providedIn: 'root'
})
export class DailyServiceService {

  constructor() { }
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl.replace(/\/+$/, ''); // Remove trailing slashes
  private urlClio= environment.urlClio;
  private paralegalbase = environment.paralegalSearchApi;

  private listCacheDailyMessage = new Map<string, DailyMessage[]>();

  tokens = signal<string>('');

  webhookToken() {
    const url = `${this.base}/tokenJwt`;
    return this.http.get<TokenN8N>(url)
  }

 //metodo para el cargue de la información de los dailys
  getDailyMessage(email: string) {
    const url = `${this.base}/list/dailys`;

   /*if( this.listCacheDailyMessage.has(email)){
    return of(this.listCacheDailyMessage.get(email) ?? []);
   }*/

    return this.http.get<DailyMessage[]>(url, { params: { email } })
    .pipe(
      map(resp => resp),
     // tap((listDailys) => this.listCacheDailyMessage.set(email, listDailys))
    );

  }

getDailyNotesMatter(idMatter: string): Observable<NotesResponse>{
    const url = `${this.base}/list/NotesMatters`;
    const urlClio = environment.urlClio;
    const params = new HttpParams()
    .set('idMatter', idMatter)
    .set('urlConsul', urlClio);
    return this.http.get<NotesResponse>(url, { params });

}


  //cargar registro a ser editado solo carga
  getDailyUpdate(idDaily: number) {
    const url = `${this.base}/Edit/registDaily`;
    const header = new HttpHeaders().set('idRegistro', `${idDaily}`)
    return this.http.get<DailyMessage[]>(url, { headers: header });

  }


  getDailyCategories() {
    const url = `${this.base}/categori`;
    return this.http.get<Categories[]>(url);
  }

getDailyContacts(phone: string) {
    const url = `${this.base}/contact/phone`;
    return this.http.get<ContactPhone[]>(url, { params: { phone } })

  }


  getDailyCallers(contactId: string) {
    const url = `${this.base}/client/matters`;  ///consumoContact

    const params = new HttpParams()
      .set('numClient', contactId)
      .set('urlAccessCli',this.urlClio);

    return this.http.get<MattersPhoneClio[]>(url, { params })
      .pipe(
        //map(data => data),//.map(item => ({ id: item.id, name: item.name }))),
        catchError((error) => {
          return throwError(() => new Error('Error consult Phone Clio: ' + error.message));
        }
        ));
  }



  getParalegalDaily(idMatter: number | string, token: string): Observable<Paralegal> {

    const url = `${this.base}/list/paralegalMatter`;//idMatter
    const params = new HttpParams()
      .set('idMater', String(idMatter))
      .set('ConsultIdMatter', String('Paralegal'));

    //const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Paralegal>(url, { params });
  }


  postRegisterDaily(deploy: object) {
    const url = `${this.base}/daily/register`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<string>(url, { body: { deploy } }, { headers });
  }




 getvalidationMatterClient(phone: string){
//consultamos y validamos desde el Webhook

const urlClio = this.urlClio;
const url = `${this.base}/contact/validationMatter`;
//debemos cargar los datos requeridos para consumir el webhook
const fields = [
      'id',
      'number',
      'custom_field_values{id,value}',
      'client_id',
      'maildrop_address',
      'client{id,name}',
      'matter_bill_recipients{recipient}',
      'relationships',
      'custom_field_set_associations',
      'custom_field_values',
      'account_balances',
      'matter_stage',
      'matter_budget',
      'group',
      'folder',
      'status',
      'relationships{id,etag,description}',
    ].join(',');
 const params = new HttpParams()
 .set('fields', fields)
 .set('phoneCliente',phone)
 .set('url',urlClio);

 return this.http.get<DetailsContact>(url,{ params });

 }


 CreateContactClio(data: object){
   const urlClio = this.urlClio;
   const url = `${this.base}/contact/postContact`;
   const params= new HttpParams()
   .set('urlClio',urlClio);

   return this.http.post<ClientCreate>(url,{ data }, {params }).pipe(
    map(r=>r)
   );
 }

 //creamos el Matter de acuerdo al IdCliente

 CreateMatterIdClientClio(data: object){
 const urlClio = this.urlClio;
 const url = `${this.base}/contact/matterAssociate`;
 const params= new HttpParams()
   .set('urlClio',urlClio);

 return this.http.post<MatterCreate>(url,{ data }, { params }).pipe(
    map(r=>r)
   );

 }


}
