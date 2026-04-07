import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClientStepConsentsComponent } from '../../steps/client-step-consents/client-step-consents.component';
import { ClientStepDetailsComponent } from '../../steps/client-step-details/client-step-details.component';
import { ClientFormService } from '../../services/client-form.service';

@Component({
  selector: 'app-client-create-page',
  imports: [CardModule, ButtonModule, ClientStepDetailsComponent, ClientStepConsentsComponent],
  templateUrl: './client-create-page.component.html',
})
export class ClientCreatePageComponent {
  private readonly clientFormService = inject(ClientFormService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly activeStep = signal(0);
  protected readonly clientForm = this.clientFormService.createForm();

  constructor() {
    this.clientForm.controls.details.controls.clientType.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((clientType) => {
        this.clientFormService.applyClientTypeValidators(this.clientForm, clientType);
      });
  }

  protected goNext(): void {
    if (this.activeStep() === 0) {
      this.clientFormService.markDetailsStepAsTouched(this.clientForm);

      if (this.clientForm.controls.details.invalid) {
        return;
      }

      this.activeStep.set(1);
    }
  }

  protected goBack(): void {
    if (this.activeStep() > 0) {
      this.activeStep.update((value) => value - 1);
    }
  }
}
