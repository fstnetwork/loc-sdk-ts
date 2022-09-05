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

      LoggingAgent.info("test HttpPayload");
      LoggingAgent.info(typeof this.context.payload);
      LoggingAgent.info(`${"http" in this.context.payload}`);

      if ("http" in this.context.payload) {
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
        } = this.context.payload.http;

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
