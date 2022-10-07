import {
  EventAgent,
  GenericLogic,
  LoggingAgent,
  Logic,
  RailwayError,
  SessionStorageAgent,
} from '@fstnetwork/logic';

@Logic()
export default class GenericA extends GenericLogic {
  async run() {
    await SessionStorageAgent.putJson('fstnetwork', 6000 as number);
    await SessionStorageAgent.putJson('magic', 9487 as number);

    await EventAgent.emit([
      {
        labelName: 'test-label',
        sourceDigitalIdentity: 'my-source-id',
        targetDigitalIdentity: 'my-target-id',
        meta: `meta ${333}`,
        type: '',
      },
    ]);
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
