import { AggregatorLogic, Logic, RailwayError } from "@fstnetwork/logic";

@Logic()
export class Aggregator extends AggregatorLogic {
  async run() {
    let value = (await this.context.agents.sessionStorage.get(
      "kuma"
    )) as Number;
    await this.context.agents.result.finalize({ kuma: value });
  }

  async handleError(_error: RailwayError) {}
}
