import {
  GenericLogic,
  Logic,
  LoggingAgent,
  RailwayError,
} from '@fstnetwork/logic';

@Logic()
export default class TestRailwaySwitch extends GenericLogic {
  async run() {
    LoggingAgent.info('on Railway Ok');
    throw new URIError('invalid URI');
  }

  async handleError(error: RailwayError) {
    LoggingAgent.info('on Railway Error');
    LoggingAgent.info(`Name: ${error.name}`);
    LoggingAgent.info(
      `Logic Permanent Identity: ${error.logicPermanentIdentity}`
    );
    LoggingAgent.info(`Logic Revision: ${error.logicRevision}`);
    LoggingAgent.info(`Err: ${error.message}`);
  }
}
