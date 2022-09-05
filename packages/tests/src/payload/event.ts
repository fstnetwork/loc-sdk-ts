import {
  GenericLogic,
  Logic,
  LoggingAgent,
  RailwayError,
} from "@fstnetwork/logic";

@Logic()
export class TestEventPayload extends GenericLogic {
  async run() {
    LoggingAgent.info(this.context.task);

    LoggingAgent.info("test EventPayload");
    LoggingAgent.info(typeof this.context.payload);
    LoggingAgent.info(`${"event" in this.context.payload}`);
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
