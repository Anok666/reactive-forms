import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_CONSENTS } from '../mocks/consents.mock';
import type { ClientType, ConsentDto } from '../models';

@Injectable({ providedIn: 'root' })
export class ConsentsApiService {
  private readonly delayMs = 900;

  getConsents(clientType: ClientType): Observable<ConsentDto[]> {
    const list = MOCK_CONSENTS.filter(
      (consent) =>
        consent.inUse &&
        (!consent.forClientTypes?.length || consent.forClientTypes.includes(clientType)),
    );
    return of(list).pipe(delay(this.delayMs));
  }
}
