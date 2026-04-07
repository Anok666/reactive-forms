import { Component } from '@angular/core';

@Component({
  selector: 'app-client-step-consents',
  imports: [],
  templateUrl: './client-step-consents.component.html',
})
export class ClientStepConsentsComponent {
  protected readonly mockConsents = [
    'Zgoda marketingowa email',
    'Zgoda marketingowa telefoniczna',
    'Zgoda na przetwarzanie danych',
  ];
}
