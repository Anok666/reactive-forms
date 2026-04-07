import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ClientStepConsentsComponent } from '../../steps/client-step-consents/client-step-consents.component';
import { ClientStepDetailsComponent } from '../../steps/client-step-details/client-step-details.component';

@Component({
  selector: 'app-client-create-page',
  imports: [CardModule, ButtonModule, ClientStepDetailsComponent, ClientStepConsentsComponent],
  templateUrl: './client-create-page.component.html',
})
export class ClientCreatePageComponent {
  protected readonly activeStep = signal(0);

  protected goNext(): void {
    if (this.activeStep() < 1) {
      this.activeStep.update((value) => value + 1);
    }
  }

  protected goBack(): void {
    if (this.activeStep() > 0) {
      this.activeStep.update((value) => value - 1);
    }
  }
}
