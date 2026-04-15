import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import type { ClientDetailsForm } from '../../../models';
import { ClientDetailsFormFieldComponent } from './client-details-form-field.component';

@Component({
  selector: 'app-client-details-person-fields',
  imports: [ReactiveFormsModule, InputTextModule, ClientDetailsFormFieldComponent],
  template: `
    <ng-container [formGroup]="form()">
      <app-client-details-form-field
        label="Imie"
        forId="firstName"
        [showError]="showError('firstName')"
        errorMessage="Imie jest wymagane."
      >
        <input
          id="firstName"
          pInputText
          placeholder="Jan"
          formControlName="firstName"
          [fluid]="true"
        />
      </app-client-details-form-field>

      <app-client-details-form-field
        label="Nazwisko"
        forId="lastName"
        [showError]="showError('lastName')"
        errorMessage="Nazwisko jest wymagane."
      >
        <input
          id="lastName"
          pInputText
          placeholder="Kowalski"
          formControlName="lastName"
          [fluid]="true"
        />
      </app-client-details-form-field>
    </ng-container>
  `,
})
export class ClientDetailsPersonFieldsComponent {
  readonly form = input.required<FormGroup<ClientDetailsForm>>();

  protected showError(controlName: keyof ClientDetailsForm): boolean {
    const control = this.form().controls[controlName];
    return control.invalid && control.touched;
  }
}
