import { AggregatorLogic, Logic, RailwayError } from '@fstnetwork/logic';

@Logic()
export default class EmptyAggregatorLogic extends AggregatorLogic {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async run() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async handleError(_error: RailwayError) {}
}
