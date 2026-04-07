import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientCreateForm, ClientType } from '../models/client-form.model';

@Injectable({ providedIn: 'root' })
export class ClientFormService {
  private readonly formBuilder = inject(FormBuilder);
  private readonly nipPattern = /^\d{10}$/;

  createForm(): FormGroup<ClientCreateForm> {
    const form = this.formBuilder.nonNullable.group({
      details: this.formBuilder.nonNullable.group({
        clientType: 'PERSON' as ClientType,
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        companyName: [''],
        nip: [''],
        email: ['', [Validators.required, Validators.email]],
      }),
    });

    this.applyClientTypeValidators(form, form.controls.details.controls.clientType.value);

    return form;
  }

  applyClientTypeValidators(form: FormGroup<ClientCreateForm>, clientType: ClientType): void {
    const details = form.controls.details.controls;
    const personValidators = [Validators.required, Validators.minLength(2)];
    const companyValidators = [Validators.required, Validators.minLength(2)];
    const nipValidators = [Validators.required, Validators.pattern(this.nipPattern)];

    if (clientType === 'PERSON') {
      details.firstName.setValidators(personValidators);
      details.lastName.setValidators(personValidators);
      details.companyName.clearValidators();
      details.nip.clearValidators();
    } else {
      details.firstName.clearValidators();
      details.lastName.clearValidators();
      details.companyName.setValidators(companyValidators);
      details.nip.setValidators(nipValidators);
    }

    details.firstName.updateValueAndValidity({ emitEvent: false });
    details.lastName.updateValueAndValidity({ emitEvent: false });
    details.companyName.updateValueAndValidity({ emitEvent: false });
    details.nip.updateValueAndValidity({ emitEvent: false });
  }

  markDetailsStepAsTouched(form: FormGroup<ClientCreateForm>): void {
    const details = form.controls.details.controls;
    details.clientType.markAsTouched();
    details.firstName.markAsTouched();
    details.lastName.markAsTouched();
    details.companyName.markAsTouched();
    details.nip.markAsTouched();
    details.email.markAsTouched();
  }
}
