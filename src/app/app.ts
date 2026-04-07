import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, CardModule, InputTextModule, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly formBuilder = inject(FormBuilder);

  protected readonly title = signal('Reactive Forms Starter');
  protected readonly submittedName = signal<string | null>(null);

  protected readonly profileForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });

  protected submitForm(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.submittedName.set(this.profileForm.controls.name.value);
  }
}
