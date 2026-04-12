import { TestBed } from '@angular/core/testing';
import type { ConsentDto } from '../models';
import { ClientFormService } from './client-form.service';

describe('ClientFormService', () => {
  let service: ClientFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientFormService);
  });

  it('applies PERSON/COMPANY validators correctly', () => {
    const form = service.createForm();
    const details = form.controls.details.controls;

    details.email.setValue('john@example.com');
    details.firstName.setValue('Jan');
    details.lastName.setValue('Kowalski');
    expect(form.controls.details.valid).toBe(true);

    details.clientType.setValue('COMPANY');
    service.applyClientTypeValidators(form, 'COMPANY');
    details.firstName.setValue('');
    details.lastName.setValue('');
    details.companyName.setValue('');
    details.nip.setValue('');

    expect(details.firstName.errors).toBeNull();
    expect(details.lastName.errors).toBeNull();
    expect(form.controls.details.valid).toBe(false);

    details.companyName.setValue('Acme');
    details.nip.setValue('1234567890');
    expect(form.controls.details.valid).toBe(true);
  });

  it('creates required consent controls and validates requiredTrue', () => {
    const form = service.createForm();
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

    service.syncConsentControls(form, consents);

    expect(form.controls.consents.controls['LEGAL_RODO'].invalid).toBe(true);
    expect(form.controls.consents.controls['MKT_EMAIL'].invalid).toBe(false);

    form.controls.consents.controls['LEGAL_RODO'].setValue(true);
    expect(form.controls.consents.valid).toBe(true);
  });

  it('removes obsolete consent controls on sync', () => {
    const form = service.createForm();
    const initial: ConsentDto[] = [
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

    service.syncConsentControls(form, initial);
    expect(form.controls.consents.contains('LEGAL_RODO')).toBe(true);

    service.syncConsentControls(form, [initial[1]]);
    expect(form.controls.consents.contains('LEGAL_RODO')).toBe(false);
    expect(form.controls.consents.contains('MKT_EMAIL')).toBe(true);
  });
});
