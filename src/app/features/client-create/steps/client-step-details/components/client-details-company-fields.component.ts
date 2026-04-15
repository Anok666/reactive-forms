import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import type { ClientDetailsForm } from '../../../models';
import { ClientDetailsFormFieldComponent } from './client-details-form-field.component';

@Component({
  selector: 'app-client-details-company-fields',
  imports: [ReactiveFormsModule, InputTextModule, ClientDetailsFormFieldComponent],
  template: `
    <ng-container [formGroup]="form()">
      <app-client-details-form-field
        label="Nazwa firmy"
        forId="companyName"
        [showError]="showError('companyName')"
        errorMessage="Nazwa firmy jest wymagana."
      >
        <input
          id="companyName"
          pInputText
          placeholder="Test Company Sp. z o.o."
          formControlName="companyName"
          [fluid]="true"
        />
      </app-client-details-form-field>

      <app-client-details-form-field
        label="NIP"
        forId="nip"
        [showError]="showError('nip')"
        errorMessage="NIP jest wymagany."
      >
        <input id="nip" pInputText placeholder="1234567890" formControlName="nip" [fluid]="true" />
      </app-client-details-form-field>
    </ng-container>
  `,
})
export class ClientDetailsCompanyFieldsComponent {
  readonly form = input.required<FormGroup<ClientDetailsForm>>();

  protected showError(controlName: keyof ClientDetailsForm): boolean {
    const control = this.form().controls[controlName];
    return control.invalid && control.touched;
  }
}
