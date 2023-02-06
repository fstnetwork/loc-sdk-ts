import {
  GenericLogic,
  Logic,
  RailwayError,
  LoggingAgent,
  SessionStorageAgent,
} from '@fstnetwork/logic';

@Logic()
export default class GenericB extends GenericLogic {
  async run() {
    const value = (await SessionStorageAgent.get('fstnetwork')) as number;
    await SessionStorageAgent.putJson('kuma', Number(value) + 6000);
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
