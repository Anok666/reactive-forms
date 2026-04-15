import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-client-create-actions',
  imports: [ButtonModule],
  template: `
    <div class="mt-6 flex items-center justify-between">
      <p-button
        label="Wstecz"
        severity="secondary"
        [outlined]="true"
        (onClick)="back.emit()"
        [disabled]="activeStep() === 0 || isSaved()"
      />

      @if (isSaved()) {
        <p-button
          label="Edytuj ponownie"
          icon="pi pi-pencil"
          severity="secondary"
          (onClick)="editAgain.emit()"
        />
      } @else if (activeStep() === 0) {
        <p-button label="Dalej" icon="pi pi-arrow-right" iconPos="right" (onClick)="next.emit()" />
      } @else {
        <p-button
          label="Zapisz"
          icon="pi pi-check"
          (onClick)="save.emit()"
          [disabled]="!consentsLoaded()"
        />
      }
    </div>
  `,
})
export class ClientCreateActionsComponent {
  readonly activeStep = input.required<0 | 1>();
  readonly isSaved = input.required<boolean>();
  readonly consentsLoaded = input.required<boolean>();

  readonly back = output<void>();
  readonly next = output<void>();
  readonly save = output<void>();
  readonly editAgain = output<void>();
}
