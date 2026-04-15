import type { ClientType } from '../../../models';
import { buildCreateClientPayload } from './build-create-client-payload.util';

interface RawValueInput {
  clientType: ClientType;
}

function createRawValue({ clientType }: RawValueInput) {
  return {
    details: {
      clientType,
      firstName: 'Jan',
      lastName: 'Kowalski',
      companyName: 'Acme Sp. z o.o.',
      nip: '1234567890',
      email: 'jan@example.com',
    },
    consents: {
      LEGAL_RODO: true,
      MKT_EMAIL: false,
    },
  };
}

describe('buildCreateClientPayload', () => {
  it('maps PERSON payload fields and clears company fields', () => {
    const payload = buildCreateClientPayload(createRawValue({ clientType: 'PERSON' }));

    expect(payload.clientType).toBe('PERSON');
    expect(payload.firstName).toBe('Jan');
    expect(payload.lastName).toBe('Kowalski');
    expect(payload.companyName).toBeNull();
    expect(payload.nip).toBeNull();
    expect(payload.email).toBe('jan@example.com');
    expect(payload.consents).toEqual({
      LEGAL_RODO: true,
      MKT_EMAIL: false,
    });
  });

  it('maps COMPANY payload fields and clears person fields', () => {
    const payload = buildCreateClientPayload(createRawValue({ clientType: 'COMPANY' }));

    expect(payload.clientType).toBe('COMPANY');
    expect(payload.firstName).toBeNull();
    expect(payload.lastName).toBeNull();
    expect(payload.companyName).toBe('Acme Sp. z o.o.');
    expect(payload.nip).toBe('1234567890');
    expect(payload.email).toBe('jan@example.com');
    expect(payload.consents).toEqual({
      LEGAL_RODO: true,
      MKT_EMAIL: false,
    });
  });
});
