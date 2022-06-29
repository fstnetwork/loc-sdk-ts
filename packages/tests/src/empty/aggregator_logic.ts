import { AggregatorLogic, Logic, RailwayError } from "@fstnetwork/logic";

@Logic()
export class EmptyAggregatorLogic extends AggregatorLogic {
  async run() {}

  async handleError(_error: RailwayError) {}
}
