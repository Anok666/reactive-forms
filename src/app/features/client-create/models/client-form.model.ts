import { FormControl, FormGroup } from '@angular/forms';

export type ClientType = 'PERSON' | 'COMPANY';

export interface ClientDetailsForm {
  clientType: FormControl<ClientType>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  companyName: FormControl<string>;
  nip: FormControl<string>;
  email: FormControl<string>;
}

export interface ClientCreateForm {
  details: FormGroup<ClientDetailsForm>;
}
