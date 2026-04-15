import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-client-create-stepper',
  imports: [NgClass],
  template: `
    <nav class="mb-6" aria-label="Postep kreatora">
      <p class="mb-3 text-center text-sm text-surface-600 dark:text-surface-400">
        Krok {{ activeStep() + 1 }} z 2
      </p>
      <div class="flex gap-3">
        <div class="flex min-w-0 flex-1 flex-col gap-2">
          <span class="text-center text-xs font-medium text-surface-500 dark:text-surface-400">
            Krok 1
          </span>
          <div
            class="h-1.5 w-full rounded-full transition-colors"
            [ngClass]="activeStep() === 0 ? 'bg-teal-500' : 'bg-surface-300 dark:bg-surface-600'"
            aria-hidden="true"
          ></div>
        </div>
        <div class="flex min-w-0 flex-1 flex-col gap-2">
          <span class="text-center text-xs font-medium text-surface-500 dark:text-surface-400">
            Krok 2
          </span>
          <div
            class="h-1.5 w-full rounded-full transition-colors"
            [ngClass]="activeStep() === 1 ? 'bg-teal-500' : 'bg-surface-300 dark:bg-surface-600'"
            aria-hidden="true"
          ></div>
        </div>
      </div>
    </nav>
  `,
})
export class ClientCreateStepperComponent {
  readonly activeStep = input.required<0 | 1>();
}
