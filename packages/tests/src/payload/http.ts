import {
  GenericLogic,
  Logic,
  LoggingAgent,
  RailwayError,
} from '@fstnetwork/logic';

@Logic()
export class TestHttpPayload extends GenericLogic {
  async run() {
    {
      LoggingAgent.info(this.context.task);

      const payload = await this.context.payload();

      LoggingAgent.info('test HttpPayload');
      LoggingAgent.info(typeof payload);
      LoggingAgent.info(`${'http' in payload}`);

      if ('http' in payload) {
        const {
          apiGatewayIdentityContext,
          apiRouteIdentityContext,
          requestId,
          request: {
            data,
            headers,
            host,
            method,
            path,
            query,
            scheme,
            version,
          },
        } = payload.http;

        LoggingAgent.info(data.constructor.name);

        LoggingAgent.info({
          apiGatewayIdentityContext,
          apiRouteIdentityContext,
          requestId,
          request: {
            data: Array.from(data),
            headers,
            host,
            method,
            path,
            query,
            scheme,
            version,
          },
        });
      }
    }
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
