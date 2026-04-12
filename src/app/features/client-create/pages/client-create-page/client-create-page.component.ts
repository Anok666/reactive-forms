import { Location, NgClass } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { distinctUntilChanged, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { ClientStepConsentsComponent } from '../../steps/client-step-consents/client-step-consents.component';
import { ClientStepDetailsComponent } from '../../steps/client-step-details/client-step-details.component';
import { ClientFormService } from '../../services/client-form.service';
import { ConsentsApiService } from '../../services/consents-api.service';
import type { CreateClientPayload } from '../../models';

@Component({
  selector: 'app-client-create-page',
  imports: [
    NgClass,
    CardModule,
    ButtonModule,
    ClientStepDetailsComponent,
    ClientStepConsentsComponent,
  ],
  templateUrl: './client-create-page.component.html',
})
export class ClientCreatePageComponent {
  private readonly clientFormService = inject(ClientFormService);
  private readonly consentsApiService = inject(ConsentsApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);

  protected readonly activeStep = signal(0);
  protected readonly clientForm = this.clientFormService.createForm();
  protected readonly savedPayload = signal<CreateClientPayload | null>(null);
  protected readonly isSaved = signal(false);
  protected readonly consentsLoaded = signal(false);
  protected readonly consents$ =
    this.clientForm.controls.details.controls.clientType.valueChanges.pipe(
      startWith(this.clientForm.controls.details.controls.clientType.value),
      distinctUntilChanged(),
      switchMap((clientType) =>
        this.consentsApiService.getConsents(clientType).pipe(
          tap((consents) => {
            this.clientFormService.clearConsentSelections(this.clientForm);
            this.clientFormService.syncConsentControls(this.clientForm, consents);
            this.consentsLoaded.set(true);
          }),
        ),
      ),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  constructor() {
    this.route.queryParamMap
      .pipe(
        map((pm) => pm.get('step')),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((step) => {
        if (step !== '1' && step !== '2') {
          void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { step: '1' },
            replaceUrl: true,
          });
          return;
        }
        if (step === '2') {
          if (this.clientForm.controls.details.invalid) {
            void this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { step: '1' },
              replaceUrl: true,
            });
            return;
          }
          this.activeStep.set(1);
          return;
        }
        this.activeStep.set(0);
      });

    this.clientForm.controls.details.controls.clientType.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((clientType) => {
        this.clientFormService.applyClientTypeValidators(this.clientForm, clientType);
      });

    this.consents$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  protected goNext(): void {
    if (this.isSaved()) {
      return;
    }

    if (this.activeStep() === 0) {
      this.clientFormService.markDetailsStepAsTouched(this.clientForm);

      if (this.clientForm.controls.details.invalid) {
        return;
      }

      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { step: '2' },
        queryParamsHandling: 'merge',
      });
    }
  }

  protected goBack(): void {
    if (this.isSaved()) {
      return;
    }

    if (this.activeStep() > 0) {
      this.location.back();
    }
  }

  protected save(): void {
    if (!this.consentsLoaded()) {
      return;
    }

    this.clientFormService.markConsentsStepAsTouched(this.clientForm);

    if (this.clientForm.controls.consents.invalid) {
      return;
    }

    const payload = this.toPayload();
    this.savedPayload.set(payload);
    this.isSaved.set(true);
    this.clientForm.disable({ emitEvent: false });
    console.log('Create client payload', payload);
  }

  protected editAgain(): void {
    this.clientForm.enable({ emitEvent: false });
    this.clientFormService.applyClientTypeValidators(
      this.clientForm,
      this.clientForm.controls.details.controls.clientType.value,
    );
    this.isSaved.set(false);
    this.savedPayload.set(null);
  }

  protected savedPayloadJson(): string {
    return JSON.stringify(this.savedPayload(), null, 2);
  }

  private toPayload(): CreateClientPayload {
    const rawValue = this.clientForm.getRawValue();
    const { clientType, firstName, lastName, companyName, nip, email } = rawValue.details;

    return {
      clientType,
      firstName: clientType === 'PERSON' ? firstName : null,
      lastName: clientType === 'PERSON' ? lastName : null,
      companyName: clientType === 'COMPANY' ? companyName : null,
      nip: clientType === 'COMPANY' ? nip : null,
      email,
      consents: rawValue.consents,
    };
  }
}
