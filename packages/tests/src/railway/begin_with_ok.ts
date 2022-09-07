import {
  GenericLogic,
  Logic,
  LoggingAgent,
  RailwayError,
} from "@fstnetwork/logic";

@Logic()
export class TestBeginWithOk extends GenericLogic {
  async run() {
    LoggingAgent.info("on Railway Ok");
  }

  async handleError(_error: RailwayError) {
    LoggingAgent.info("on Railway Error");
  }
}
