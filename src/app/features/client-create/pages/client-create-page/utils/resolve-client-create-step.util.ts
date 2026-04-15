export type ClientCreateRouteStep = '1' | '2';

export interface ClientCreateStepResolution {
  routeStep: ClientCreateRouteStep;
  activeStep: 0 | 1;
  shouldRedirect: boolean;
}

const DEFAULT_STEP: ClientCreateRouteStep = '1';

export function resolveClientCreateStep(
  stepParam: string | null,
  isDetailsStepInvalid: boolean,
): ClientCreateStepResolution {
  const isSupportedStep = stepParam === '1' || stepParam === '2';
  const routeStep = isSupportedStep ? stepParam : DEFAULT_STEP;

  if (routeStep === '2' && isDetailsStepInvalid) {
    return {
      routeStep: DEFAULT_STEP,
      activeStep: 0,
      shouldRedirect: true,
    };
  }

  return {
    routeStep,
    activeStep: routeStep === '2' ? 1 : 0,
    shouldRedirect: routeStep !== stepParam,
  };
}
