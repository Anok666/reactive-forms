import type { ClientType, CreateClientPayload } from '../../../models';

interface ClientCreateDetailsRawValue {
  clientType: ClientType;
  firstName: string;
  lastName: string;
  companyName: string;
  nip: string;
  email: string;
}

interface ClientCreateRawValue {
  details: ClientCreateDetailsRawValue;
  consents: Record<string, boolean>;
}

export function buildCreateClientPayload(rawValue: ClientCreateRawValue): CreateClientPayload {
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
