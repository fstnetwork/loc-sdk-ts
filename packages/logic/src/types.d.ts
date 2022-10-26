/// <reference types="@fstnetwork/runtime" />

declare global {
  export const Saffron: typeof import('@fstnetwork/runtime');
  export const AggregatorContext: typeof Saffron.AggregatorContext;
  export const GenericContext: typeof Saffron.GenericContext;
}

export { GenericLogic, AggregatorLogic, Context, Logic } from './index';
export * from '@fstnetwork/runtime';
