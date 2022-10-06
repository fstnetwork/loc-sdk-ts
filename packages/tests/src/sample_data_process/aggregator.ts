import {
  AggregatorLogic,
  Logic,
  RailwayError,
  ResultAgent,
  SessionStorageAgent,
} from '@fstnetwork/logic';

@Logic()
export class Aggregator extends AggregatorLogic {
  async run() {
    const value = (await SessionStorageAgent.get('kuma')) as number;
    await ResultAgent.finalize({ kuma: value });
  }

  async handleError(_error: RailwayError) {}
}
