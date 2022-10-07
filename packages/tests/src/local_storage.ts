import {
  GenericLogic,
  LocalStorageAgent,
  Logic,
  LoggingAgent,
  RailwayError,
} from '@fstnetwork/logic';

@Logic()
export default class TestLocalStorage extends GenericLogic {
  async run() {
    LoggingAgent.info('test TestLocalStorage');

    // test putString by string
    await LocalStorageAgent.putString('fstnetwork', 'awesome');

    // test putByteArray by byte array
    const arr = Deno.core.encode('bar');
    await LocalStorageAgent?.putByteArray('fst', arr);

    // test putByteArray by Uint8Array
    await LocalStorageAgent?.putByteArray('kawa', new Uint8Array([121, 111]));

    // test putByteArray by string
    await LocalStorageAgent?.putByteArray('byteArrayByString', 'fromStr');

    await LocalStorageAgent?.putJson('foo', 1);
    const bar = await LocalStorageAgent?.get('foo');
    await LocalStorageAgent?.putJson('bar', bar + 3);
    await LocalStorageAgent?.putJson('baz', { baz: 777 });

    await LocalStorageAgent?.putString('deleteMe', 'shouldDelete');
    await LocalStorageAgent?.delete('deleteMe');

    const expected = Uint8Array.from([0x94, 0x87, 0x94, 0x87]);
    await LocalStorageAgent?.putByteArray('is87', expected);

    const bytes = (await LocalStorageAgent?.get('is87')) as Uint8Array;
    await LocalStorageAgent?.putJson('is87_check', {
      isUint8Array: bytes instanceof Uint8Array,
      isEqual:
        expected.length === bytes.length &&
        expected.every((element, index) => element === bytes[index]),
    });
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
