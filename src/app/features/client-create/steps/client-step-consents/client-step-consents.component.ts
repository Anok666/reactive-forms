import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, shareReplay } from 'rxjs/operators';
import { ConsentDto } from '../../models/consent.dto';
import { ConsentsApiService } from '../../services/consents-api.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-client-step-consents',
  imports: [ProgressSpinnerModule],
  templateUrl: './client-step-consents.component.html',
})
export class ClientStepConsentsComponent {
  private readonly consentsApi = inject(ConsentsApiService);

  /**
   * consents$ = getConsents().pipe( map(filter inUse), shareReplay(1) )
   */
  protected readonly consents$ = this.consentsApi.getConsents().pipe(
    map((consents) => consents.filter((c) => c.inUse)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  /** null = trwa ladowanie; potem lista zgod (tylko inUse). */
  protected readonly activeConsents = signal<ConsentDto[] | null>(null);

  constructor() {
    this.consents$.pipe(takeUntilDestroyed()).subscribe((consents) => {
      this.activeConsents.set(consents);
    });
  }
}
