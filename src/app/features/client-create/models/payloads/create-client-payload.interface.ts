import { ClientType } from '../forms/client-type.type';

export interface CreateClientPayload {
  clientType: ClientType;
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  nip: string | null;
  email: string;
  consents: Record<string, boolean>;
}
