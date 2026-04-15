import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { vi } from 'vitest';
import type { ClientCreateForm, ClientType, ConsentDto, CreateClientPayload } from '../../models';
import { ConsentsApiService } from '../../services/consents-api.service';
import { fillPersonDetails, makeDefaultConsents } from '../../testing/client-create-test-builders';
import { ClientCreatePageComponent } from './client-create-page.component';

interface ClientCreatePageTestAccess {
  clientForm: {
    controls: ClientCreateForm;
  };
  activeStep: () => number;
  consentsLoaded: () => boolean;
  savedPayload: () => CreateClientPayload | null;
  goNext: () => void;
  save: () => void;
}

/** Zgodny z `ConsentsApiService.getConsents(clientType)` — bez `delay`, żeby test był szybki. */
class ConsentsApiServiceMock implements Pick<ConsentsApiService, 'getConsents'> {
  getConsents(clientType: ClientType) {
    void clientType;
    const consents: ConsentDto[] = makeDefaultConsents();

    return of(consents);
  }
}

function createComponent(): {
  fixture: ReturnType<typeof TestBed.createComponent<ClientCreatePageComponent>>;
  component: ClientCreatePageTestAccess;
} {
  const fixture = TestBed.createComponent(ClientCreatePageComponent);
  const component = fixture.componentInstance as unknown as ClientCreatePageTestAccess;
  return { fixture, component };
}

describe('ClientCreatePageComponent', () => {
  let queryParamMap$: BehaviorSubject<ParamMap>;

  beforeEach(async () => {
    queryParamMap$ = new BehaviorSubject(convertToParamMap({ step: '1' }));

    const routerMock = {
      navigate: vi.fn((_commands: unknown[], extras?: { queryParams?: { step?: string } }) => {
        const s = extras?.queryParams?.step;
        if (s) {
          queryParamMap$.next(convertToParamMap({ step: s }));
        }
        return Promise.resolve(true);
      }),
    };

    const locationMock = {
      back: vi.fn(() => {
        queryParamMap$.next(convertToParamMap({ step: '1' }));
      }),
    };

    await TestBed.configureTestingModule({
      imports: [ClientCreatePageComponent],
      providers: [
        { provide: ConsentsApiService, useClass: ConsentsApiServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: queryParamMap$.asObservable(),
          },
        },
        { provide: Router, useValue: routerMock },
        { provide: Location, useValue: locationMock },
      ],
    }).compileComponents();
  });

  it('handles flow step 1 -> step 2 -> save with consent validation', async () => {
    const { fixture, component } = createComponent();

    fixture.detectChanges();

    fillPersonDetails(component.clientForm);

    component.goNext();
    expect(component.activeStep()).toBe(1);

    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.consentsLoaded()).toBe(true);

    component.save();
    expect(component.savedPayload()).toBeNull();

    component.clientForm.controls.consents.controls['LEGAL_RODO'].setValue(true);
    component.save();

    const payload = component.savedPayload();
    expect(payload).not.toBeNull();
    if (!payload) {
      throw new Error('Expected payload after selecting required consent');
    }
    expect(payload.clientType).toBe('PERSON');
    expect(payload.firstName).toBe('Jan');
    expect(payload.lastName).toBe('Kowalski');
    expect(payload.companyName).toBeNull();
    expect(payload.nip).toBeNull();
    expect(payload.consents['LEGAL_RODO']).toBe(true);
    expect(payload.consents['MKT_EMAIL']).toBe(false);
  });
});
