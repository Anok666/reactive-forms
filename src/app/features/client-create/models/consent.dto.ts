export type ConsentScope = 'MARKETING' | 'LEGAL' | 'TECH';

export interface ConsentDto {
  id: string;
  code: string;
  title: string;
  description?: string;
  required: boolean;
  inUse: boolean;
  scope: ConsentScope;
}
