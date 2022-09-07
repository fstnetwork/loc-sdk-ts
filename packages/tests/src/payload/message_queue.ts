import {
  GenericLogic,
  Logic,
  LoggingAgent,
  RailwayError,
} from "@fstnetwork/logic";

@Logic()
export class TestMessageQueuePayload extends GenericLogic {
  async run() {
    {
      LoggingAgent.info(this.context.task);

      LoggingAgent.info("test MessageQueuePayload");
      LoggingAgent.info(typeof this.context.payload);
      LoggingAgent.info(`${"messageQueue" in this.context.payload}`);

      if ("messageQueue" in this.context.payload) {
        const { clientIdentityContext, subscriber, data } =
          this.context.payload.messageQueue;

        LoggingAgent.info(data.constructor.name);

        LoggingAgent.info({
          clientIdentityContext,
          subscriber,
          data: Array.from(data),
        });
      }
    }
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
