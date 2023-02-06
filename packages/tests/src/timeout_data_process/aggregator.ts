import {
  AggregatorLogic,
  Logic,
  LoggingAgent,
  RailwayError,
  ResultAgent,
  SessionStorageAgent,
} from '@fstnetwork/logic';

@Logic()
export default class Aggregator extends AggregatorLogic {
  async run() {
    const value = (await SessionStorageAgent.get('fstnetwork')) as number;
    await ResultAgent.finalize({ kuma: value });
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
