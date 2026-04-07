import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ClientDetailsForm } from '../../models/client-form.model';

@Component({
  selector: 'app-client-step-details',
  imports: [ReactiveFormsModule, SelectModule, InputTextModule],
  templateUrl: './client-step-details.component.html',
})
export class ClientStepDetailsComponent {
  readonly form = input.required<FormGroup<ClientDetailsForm>>();

  protected readonly clientTypes = [
    { label: 'Osoba fizyczna', value: 'PERSON' },
    { label: 'Firma', value: 'COMPANY' },
  ];

  protected showError(controlName: keyof ClientDetailsForm): boolean {
    const control = this.form().controls[controlName];
    return control.invalid && control.touched;
  }
}
