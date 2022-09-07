import {
  GenericLogic,
  Logic,
  LoggingAgent,
  RailwayError,
} from "@fstnetwork/logic";

@Logic()
export class TestRailwayInternalSwitch extends GenericLogic {
  async run() {
    throw Error("my error message");
  }

  async handleError(error: RailwayError) {
    LoggingAgent.info("on Railway Error");
    LoggingAgent.info(
      `Logic Permanent Identity: ${error.logicPermanentIdentity}`
    );
    LoggingAgent.info(`Logic Revision: ${error.logicRevision}`);
    LoggingAgent.info(`Err: ${error.message}`);
  }
}
