import {
  GenericLogic,
  Logic,
  LoggingAgent,
  RailwayError,
  SessionStorageAgent,
} from '@fstnetwork/logic';

@Logic()
export default class TestSessionStorage extends GenericLogic {
  async run() {
    LoggingAgent.info('test TestSessionStorage');

    await SessionStorageAgent.putString('fstnetwork', 'awesome');

    await SessionStorageAgent.putJson('foo', 1 as number);

    const bar = Number(await SessionStorageAgent.get('foo')) + 3;
    await SessionStorageAgent.putJson('bar', bar);

    const expected = Uint8Array.from([0x94, 0x87, 0x94, 0x87]);
    await SessionStorageAgent.putByteArray('is87', expected);

    const bytes = (await SessionStorageAgent.get('is87')) as Uint8Array;
    await SessionStorageAgent.putJson('is87_check', {
      isUint8Array: bytes instanceof Uint8Array,
      isEqual:
        expected.length === bytes.length &&
        expected.every((element, index) => element === bytes[index]),
    });

    await SessionStorageAgent.putString('deleteMe', 'shouldDelete');
    await SessionStorageAgent.delete('deleteMe');
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
