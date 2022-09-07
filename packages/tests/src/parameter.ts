import {
  GenericLogic,
  Logic,
  LoggingAgent,
  Parameter,
  RailwayError,
} from "@fstnetwork/logic";

@Logic()
export class TestParameter extends GenericLogic {
  async run() {
    const homeless = Parameter.get("homeless");
    const doge = Parameter.get("shibainu");

    LoggingAgent.info({
      homeless: homeless === null,
    });

    LoggingAgent.info({
      shibainu: doge,
    });
  }

  async handleError(_error: RailwayError) {}
}
