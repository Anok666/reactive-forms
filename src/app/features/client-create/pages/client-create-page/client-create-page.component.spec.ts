import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import type { ClientCreateForm, ConsentDto, CreateClientPayload } from '../../models';
import { ConsentsApiService } from '../../services/consents-api.service';
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

class ConsentsApiServiceMock {
  getConsents() {
    const consents: ConsentDto[] = [
      {
        id: '1',
        code: 'LEGAL_RODO',
        title: 'RODO',
        required: true,
        inUse: true,
        scope: 'LEGAL',
      },
      {
        id: '2',
        code: 'MKT_EMAIL',
        title: 'Marketing email',
        required: false,
        inUse: true,
        scope: 'MARKETING',
      },
    ];

    return of(consents);
  }
}

describe('ClientCreatePageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCreatePageComponent],
      providers: [{ provide: ConsentsApiService, useClass: ConsentsApiServiceMock }],
    }).compileComponents();
  });

  it('handles flow step 1 -> step 2 -> save with consent validation', async () => {
    const fixture = TestBed.createComponent(ClientCreatePageComponent);
    const component = fixture.componentInstance as unknown as ClientCreatePageTestAccess;

    fixture.detectChanges();

    component.clientForm.controls.details.controls.clientType.setValue('PERSON');
    component.clientForm.controls.details.controls.firstName.setValue('Jan');
    component.clientForm.controls.details.controls.lastName.setValue('Kowalski');
    component.clientForm.controls.details.controls.email.setValue('jan@acme.com');

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
