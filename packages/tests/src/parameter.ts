import {
  GenericLogic,
  Logic,
  Parameter,
  RailwayError,
} from "@fstnetwork/logic";

@Logic()
export class TestParameter extends GenericLogic {
  async run() {
    const homeless = Parameter.get("homeless");
    const doge = Parameter.get("shibainu");

    this.context.agents.logging.info({
      homeless: homeless === null,
    });

    this.context.agents.logging.info({
      shibainu: doge,
    });
  }

  async handleError(_error: RailwayError) {}
}
