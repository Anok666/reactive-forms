import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import type { ClientDetailsForm } from '../../../models';

@Component({
  selector: 'app-client-details-person-fields',
  imports: [ReactiveFormsModule, InputTextModule],
  template: `
    <ng-container [formGroup]="form()">
      <div class="flex min-w-0 flex-col gap-2">
        <label for="firstName" class="font-medium">Imie</label>
        <input
          id="firstName"
          pInputText
          placeholder="Jan"
          formControlName="firstName"
          [fluid]="true"
        />
        <div class="form-field-message-slot md:break-words" aria-live="polite">
          @if (showError('firstName')) {
            <small class="block text-red-500" role="alert">Imie jest wymagane.</small>
          }
        </div>
      </div>

      <div class="flex min-w-0 flex-col gap-2">
        <label for="lastName" class="font-medium">Nazwisko</label>
        <input
          id="lastName"
          pInputText
          placeholder="Kowalski"
          formControlName="lastName"
          [fluid]="true"
        />
        <div class="form-field-message-slot md:break-words" aria-live="polite">
          @if (showError('lastName')) {
            <small class="block text-red-500" role="alert">Nazwisko jest wymagane.</small>
          }
        </div>
      </div>
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
