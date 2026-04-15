import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import type { ClientDetailsForm } from '../../../models';

@Component({
  selector: 'app-client-details-company-fields',
  imports: [ReactiveFormsModule, InputTextModule],
  template: `
    <ng-container [formGroup]="form()">
      <div class="flex min-w-0 flex-col gap-2">
        <label for="companyName" class="font-medium">Nazwa firmy</label>
        <input
          id="companyName"
          pInputText
          placeholder="Test Company Sp. z o.o."
          formControlName="companyName"
          [fluid]="true"
        />
        <div class="form-field-message-slot md:break-words" aria-live="polite">
          @if (showError('companyName')) {
            <small class="block text-red-500" role="alert">Nazwa firmy jest wymagana.</small>
          }
        </div>
      </div>

      <div class="flex min-w-0 flex-col gap-2">
        <label for="nip" class="font-medium">NIP</label>
        <input id="nip" pInputText placeholder="1234567890" formControlName="nip" [fluid]="true" />
        <div class="form-field-message-slot md:break-words" aria-live="polite">
          @if (showError('nip')) {
            <small class="block text-red-500" role="alert">NIP jest wymagany.</small>
          }
        </div>
      </div>
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
