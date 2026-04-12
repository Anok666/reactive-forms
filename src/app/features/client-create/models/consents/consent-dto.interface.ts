import type { ClientType } from '../forms/client-type.type';
import { ConsentScope } from './consent-scope.type';

export interface ConsentDto {
  id: string;
  code: string;
  title: string;
  description?: string;
  required: boolean;
  inUse: boolean;
  scope: ConsentScope;
  /** Brak / pusta tablica = obowiazuje dla kazdego typu klienta. */
  forClientTypes?: ClientType[];
}
