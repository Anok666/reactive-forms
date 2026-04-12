import { FormControl } from '@angular/forms';
import { ClientType } from './client-type.type';

export interface ClientDetailsForm {
  clientType: FormControl<ClientType>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  companyName: FormControl<string>;
  nip: FormControl<string>;
  email: FormControl<string>;
}
