import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-client-details-form-field',
  imports: [NgClass],
  template: `
    <div class="flex min-w-0 flex-col gap-2" [ngClass]="{ 'md:col-span-2': fullWidth() }">
      <label [for]="forId()" class="font-medium">{{ label() }}</label>
      <ng-content />
      <div class="form-field-message-slot md:break-words" aria-live="polite">
        @if (showError()) {
          <small class="block text-red-500" role="alert">{{ errorMessage() }}</small>
        }
      </div>
    </div>
  `,
})
export class ClientDetailsFormFieldComponent {
  readonly label = input.required<string>();
  readonly forId = input.required<string>();
  readonly showError = input(false);
  readonly errorMessage = input('');
  readonly fullWidth = input(false);
}
