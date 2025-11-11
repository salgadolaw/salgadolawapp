export interface NotesResponse {
 meta: {
    paging: Record<string, unknown>;
    records: number;
  };
  data: NoteItem[];
}


export interface NoteItem {
  id: number;
  subject: string;
  detail: string;
  type: string; // o 'Matter' si siempre es ese valor
}
