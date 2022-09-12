import {
  GenericLogic,
  Logic,
  LoggingAgent,
  RailwayError,
} from "@fstnetwork/logic";

@Logic()
export class TestHttpPayload extends GenericLogic {
  async run() {
    {
      LoggingAgent.info(this.context.task);

      const payload = await this.context.payload();

      LoggingAgent.info("test HttpPayload");
      LoggingAgent.info(typeof payload);
      LoggingAgent.info(`${"http" in payload}`);

      if ("http" in payload) {
        const {
          apiGatewayIdentityContext,
          apiRouteIdentityContext,
          headers,
          host,
          method,
          path,
          query,
          requestId,
          scheme,
          version,
          body,
        } = payload.http;

        LoggingAgent.info(body.constructor.name);

        LoggingAgent.info({
          apiGatewayIdentityContext,
          apiRouteIdentityContext,
          headers,
          host,
          method,
          path,
          query,
          requestId,
          scheme,
          version,
          body: Array.from(body),
        });
      }
    }
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
