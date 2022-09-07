import {
  AggregatorLogic,
  Logic,
  RailwayError,
  ResultAgent,
} from "@fstnetwork/logic";

@Logic()
export class TestResult extends AggregatorLogic {
  async run() {
    ResultAgent.finalize({
      fstnetwork: "awesome",
      magicNumber: 9487,
      result2: null,
      error: null,
    });
  }

  async handleError(_error: RailwayError) {}
}
