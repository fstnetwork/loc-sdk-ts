import {
  GenericLogic,
  Logic,
  LoggingAgent,
  RailwayError,
} from '@fstnetwork/logic';

@Logic()
export class TestRailwayBeginWithError extends GenericLogic {
  async run() {
    LoggingAgent.info('on Railway Ok');
  }

  async handleError(error: RailwayError) {
    LoggingAgent.info('on Railway Error');
    LoggingAgent.info(
      `Logic Permanent Identity: ${error.logicPermanentIdentity}`,
    );
    LoggingAgent.info(`Logic Revision: ${error.logicRevision}`);
    LoggingAgent.info(`Err: ${error.message}`);
  }
}
