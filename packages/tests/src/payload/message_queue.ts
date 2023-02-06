import {
  GenericLogic,
  Logic,
  LoggingAgent,
  RailwayError,
} from '@fstnetwork/logic';

@Logic()
export default class TestMessageQueuePayload extends GenericLogic {
  async run() {
    LoggingAgent.info(this.context.task);

    const payload = await this.context.payload();

    LoggingAgent.info('test MessageQueuePayload');
    LoggingAgent.info(typeof payload);
    LoggingAgent.info(`${'messageQueue' in payload}`);

    if ('messageQueue' in payload) {
      const { clientIdentityContext, subscriber, data } = payload.messageQueue;

      LoggingAgent.info(data.constructor.name);

      LoggingAgent.info({
        clientIdentityContext,
        subscriber,
        data: Array.from(data),
      });
    }
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
