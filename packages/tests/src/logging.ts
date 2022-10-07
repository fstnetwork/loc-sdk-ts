import {
  GenericLogic,
  Logic,
  LoggingAgent,
  RailwayError,
} from '@fstnetwork/logic';

@Logic()
export default class TestLogging extends GenericLogic {
  async run() {
    LoggingAgent.error('error log');
    LoggingAgent.warn('warn log');
    LoggingAgent.info('info log');
    LoggingAgent.debug('debug log');
    LoggingAgent.trace('trace log');

    LoggingAgent.info({
      abc: 87,
    });
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
