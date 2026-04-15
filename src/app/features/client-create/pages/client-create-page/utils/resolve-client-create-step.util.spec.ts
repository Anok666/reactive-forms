import { resolveClientCreateStep } from './resolve-client-create-step.util';

describe('resolveClientCreateStep', () => {
  it('defaults invalid step param to step 1 and redirects', () => {
    const resolution = resolveClientCreateStep('invalid', false);

    expect(resolution).toEqual({
      routeStep: '1',
      activeStep: 0,
      shouldRedirect: true,
    });
  });

  it('keeps step 2 when details step is valid', () => {
    const resolution = resolveClientCreateStep('2', false);

    expect(resolution).toEqual({
      routeStep: '2',
      activeStep: 1,
      shouldRedirect: false,
    });
  });

  it('forces step 1 when details step is invalid on step 2', () => {
    const resolution = resolveClientCreateStep('2', true);

    expect(resolution).toEqual({
      routeStep: '1',
      activeStep: 0,
      shouldRedirect: true,
    });
  });
});
