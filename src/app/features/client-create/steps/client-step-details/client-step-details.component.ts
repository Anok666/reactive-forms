import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-client-step-details',
  imports: [SelectModule, InputTextModule],
  templateUrl: './client-step-details.component.html',
})
export class ClientStepDetailsComponent {
  protected readonly clientTypes = [
    { label: 'Osoba fizyczna', value: 'PERSON' },
    { label: 'Firma', value: 'COMPANY' },
  ];
}
