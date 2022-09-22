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

    const payload = await this.context.payload();

    LoggingAgent.info("test EventPayload");
    LoggingAgent.info(typeof payload);
    LoggingAgent.info(`${"event" in payload}`);
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
