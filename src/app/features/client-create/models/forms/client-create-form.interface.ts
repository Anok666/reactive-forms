import { FormControl, FormGroup, FormRecord } from '@angular/forms';
import { ClientDetailsForm } from './client-details-form.interface';

export interface ClientCreateForm {
  details: FormGroup<ClientDetailsForm>;
  consents: FormRecord<FormControl<boolean>>;
}
