import {
  AggregatorContext,
  LoggingAgent,
  RailwayError,
  ResultAgent,
} from '@fstnetwork/logic';

Object.assign(globalThis, {
  async run(_ctx: AggregatorContext) {
    ResultAgent.finalize({
      result: 16 - 9,
    });
  },
  async handleError(_ctx: AggregatorContext, error: RailwayError) {
    LoggingAgent.error(`${error}`);
  },
});
