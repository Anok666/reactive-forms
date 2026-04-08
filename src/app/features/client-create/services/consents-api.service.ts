import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_CONSENTS } from '../mocks/consents.mock';
import type { ConsentDto } from '../models';

@Injectable({ providedIn: 'root' })
export class ConsentsApiService {
  private readonly delayMs = 900;

  getConsents(): Observable<ConsentDto[]> {
    return of(MOCK_CONSENTS).pipe(delay(this.delayMs));
  }
}
