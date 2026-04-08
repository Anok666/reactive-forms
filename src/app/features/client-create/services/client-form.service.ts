import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormRecord, Validators } from '@angular/forms';
import type { ClientCreateForm, ClientType, ConsentDto } from '../models';

@Injectable({ providedIn: 'root' })
export class ClientFormService {
  private readonly formBuilder = inject(FormBuilder);
  private readonly nipPattern = /^\d{10}$/;

  createForm(): FormGroup<ClientCreateForm> {
    const details = this.formBuilder.nonNullable.group({
      clientType: 'PERSON' as ClientType,
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      companyName: [''],
      nip: [''],
      email: ['', [Validators.required, Validators.email]],
    });
    const consents = new FormRecord<FormControl<boolean>>({});

    const form = this.formBuilder.nonNullable.group({
      details,
      consents,
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

  syncConsentControls(form: FormGroup<ClientCreateForm>, consents: ConsentDto[]): void {
    const controls = form.controls.consents.controls;
    const consentCodes = new Set(consents.map((consent) => consent.code));

    for (const existingCode of Object.keys(controls)) {
      if (!consentCodes.has(existingCode)) {
        form.controls.consents.removeControl(existingCode);
      }
    }

    for (const consent of consents) {
      const validators = consent.required ? [Validators.requiredTrue] : [];
      const existingControl = form.controls.consents.controls[consent.code];

      if (!existingControl) {
        form.controls.consents.addControl(
          consent.code,
          new FormControl(false, {
            nonNullable: true,
            validators,
          }),
        );
        continue;
      }

      existingControl.setValidators(validators);
      existingControl.updateValueAndValidity({ emitEvent: false });
    }
  }

  markConsentsStepAsTouched(form: FormGroup<ClientCreateForm>): void {
    for (const control of Object.values(form.controls.consents.controls)) {
      control.markAsTouched();
    }
  }
}
