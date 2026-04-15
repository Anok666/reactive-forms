import type { ClientCreateForm, ConsentDto } from '../models';
import type { ConsentBuilderInput, FillPersonDetailsInput } from './types';

export function makeConsent({
  id = '1',
  code,
  title = code,
  required = false,
  inUse = true,
  scope = 'MARKETING',
  description,
}: ConsentBuilderInput): ConsentDto {
  return {
    id,
    code,
    title,
    required,
    inUse,
    scope,
    description,
  };
}

export function makeDefaultConsents(): ConsentDto[] {
  return [
    makeConsent({
      id: '1',
      code: 'LEGAL_RODO',
      title: 'RODO',
      required: true,
      scope: 'LEGAL',
    }),
    makeConsent({
      id: '2',
      code: 'MKT_EMAIL',
      title: 'Marketing email',
      required: false,
      scope: 'MARKETING',
    }),
  ];
}

export function fillPersonDetails(
  form: { controls: ClientCreateForm },
  details: FillPersonDetailsInput = {},
): void {
  const controls = form.controls.details.controls;

  controls.clientType.setValue('PERSON');
  controls.firstName.setValue(details.firstName ?? 'Jan');
  controls.lastName.setValue(details.lastName ?? 'Kowalski');
  controls.email.setValue(details.email ?? 'jan@acme.com');
}
