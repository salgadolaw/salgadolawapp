export interface DetailsContact {
  records: number;
  idClient: number;
  data:    Datum[];
}

export interface Datum {
  id:                            number;
  number:                        number;
  custom_field_values:           CustomFieldValue[];
  client_id:                     number;
  maildrop_address:              string;
  client:                        Client;
  matter_bill_recipients:        MatterBillRecipient[];
  relationships:                 Relationship[];
  custom_field_set_associations: Folder[];
  account_balances:              any[];
  matter_stage:                  null;
  matter_budget:                 null;
  group:                         Group;
  folder:                        Folder;
  status:                        string;
}

export interface Client {
  id:   number;
  name: string;
}

export interface Folder {
  id:   number;
  etag: string;
}

export interface CustomFieldValue {
  id:    string;
  value: boolean | number | null | string;
}

export interface Group {
  id:        number;
  etag:      string;
  name:      string;
  type:      string;
  initials?: string;
}

export interface MatterBillRecipient {
  recipient: Group;
}

export interface Relationship {
  id:          number;
  etag:        string;
  description: string;
}


export interface CreateContact {
  data: Data;
}

export interface Data {
  type:            string;
  first_name:      string;
  last_name:       string;
  email_addresses: EmailAddress[];
  phone_numbers:   PhoneNumber[];
}

export interface EmailAddress {
  name:          string;
  address:       string;
  default_email: boolean;
}

export interface PhoneNumber {
  name:           string;
  number:         string;
  default_number: boolean;
}

export interface ClientCreate {
  id: number;
  name: string;
  type: string;
  etag: string;
}
