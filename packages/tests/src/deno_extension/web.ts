import {
  GenericLogic,
  Logic,
  LoggingAgent,
  RailwayError,
  SessionStorageAgent,
} from '@fstnetwork/logic';

@Logic()
export class TestWeb extends GenericLogic {
  async run() {
    LoggingAgent.info('test TestWeb');

    const base64EncodeText = btoa('hello world');
    await SessionStorageAgent.putByteArray(
      'base64EncodeText',
      Deno.core.encode(base64EncodeText),
    );

    const base64PlainText = atob(base64EncodeText);
    await SessionStorageAgent.putByteArray(
      'base64PlainText_uint8Array',
      Deno.core.encode(base64PlainText),
    );
    const base64PlainTextString = atob('TWFnaWM=');
    await SessionStorageAgent.putByteArray(
      'base64PlainText_string',
      Deno.core.encode(base64PlainTextString),
    );

    const uint8array = new TextEncoder().encode('Hi 你好 🐳');
    await SessionStorageAgent.putByteArray('uint8array', uint8array);

    const string = new TextDecoder().decode(uint8array);
    await SessionStorageAgent.putString('string', string);

    const blob = new Blob([JSON.stringify({ hello: 'world' })], {
      type: 'application/json',
    });
    await SessionStorageAgent.putJson('blob_size', blob.size as number);
    await SessionStorageAgent.putString('blob_type', blob.type);

    const reader = new FileReader();
    reader.addEventListener('loadend', async () => {
      // reader.result contains the contents of blob as a typed array
      const decoder = new TextDecoder();
      const result = decoder.decode(reader.result);

      await SessionStorageAgent.putString('fileReader_result', result);
    });
    reader.readAsArrayBuffer(blob);
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
