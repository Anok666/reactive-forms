import { ConsentScope } from './consent-scope.type';

export interface ConsentDto {
  id: string;
  code: string;
  title: string;
  description?: string;
  required: boolean;
  inUse: boolean;
  scope: ConsentScope;
}
