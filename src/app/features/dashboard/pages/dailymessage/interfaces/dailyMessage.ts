
export interface DailyMessage {
  pk_iddaily:     string;
  phone:          string;
  caller:         string;
  clio:           string;
  fk_idcategoria: string;
  v_namecategori: string;
  paralegal:      string;
  mailparalegal:  string;
  observation:    string;
  fk_states:      string;
  v_namestate:    string;
  dateregister:   string;
  fk_iduser:      string;
  email:          string;
  username:       string;
  idcontact:      string;
  contact:        string;
}

export interface Categories {
  pk_idcategoria: string;
  v_namecategori: string;
  fk_states:      string;
}

export interface PhoneContact {
  id: string;
  name: string;
}

export interface ContactPhone {
  id:   number;
  name: string;
}

export interface MatterPhoneClio {
  id:   number;
  display_number: string;
  maildrop_address: string;
  description: string;
  tag: string[];
}

export interface MattersPhoneClio {
  id:   number;
  name: string;
}

export interface Paralegal {
  id:       null;
  option:   null;
  mailDrop: string;
}

export interface TokenN8N {
  token: string;
}



