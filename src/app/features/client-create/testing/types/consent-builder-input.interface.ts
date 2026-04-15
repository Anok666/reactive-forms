import type { ConsentScope } from '../../models';

export interface ConsentBuilderInput {
  id?: string;
  code: string;
  title?: string;
  required?: boolean;
  inUse?: boolean;
  scope?: ConsentScope;
  description?: string;
}
