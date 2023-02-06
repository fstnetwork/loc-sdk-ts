import {
  GenericLogic,
  Logic,
  LoggingAgent,
  RailwayError,
  SessionStorageAgent,
} from '@fstnetwork/logic';

@Logic()
export default class GenericA extends GenericLogic {
  async run() {
    let i = 0;
    await SessionStorageAgent.putJson('fstnetwork', i);

    while (true) {
      i += 1;
    }
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
