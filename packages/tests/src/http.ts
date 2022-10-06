import {
  GenericLogic,
  Logic,
  LoggingAgent,
  Http,
  HttpAgent,
  RailwayError,
  SessionStorageAgent,
} from '@fstnetwork/logic';

@Logic()
export class TestHttp extends GenericLogic {
  async run() {
    LoggingAgent.info('test TestHttp');

    await this.testHttpGet();
    await this.testHttpPost();
    await this.testHttpPut();
    await this.testHttpPatch();
    await this.testHttpDelete();
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }

  async testHttpGet() {
    const httpAgent = await HttpAgent?.acquire('test-http-server')!;

    const resp = await httpAgent.get('/resource', {}, Http.ContentType.Json)!;

    await SessionStorageAgent.putJson('GET.status', resp.status as number);
    await SessionStorageAgent.putJson('GET.headers', resp.headers);
    await SessionStorageAgent.putByteArray('GET.body', resp.body);
  }

  async testHttpPost() {
    const httpAgent = await HttpAgent?.acquire('test-http-server')!;

    const resp = await httpAgent.post(
      '/resource',
      {
        'content-type': 'application/json',
      },
      Http.ContentType.Json,
      new Uint8Array([123, 34, 97, 34, 58, 51, 51, 125]),
    )!;

    await SessionStorageAgent.putJson('POST.status', resp.status as number);
    await SessionStorageAgent.putJson('POST.headers', resp.headers);
    await SessionStorageAgent.putByteArray('POST.body', resp.body);
  }

  async testHttpPut() {
    const httpAgent = await HttpAgent?.acquire('test-http-server')!;

    const resp = await httpAgent.put(
      '/resource/1',
      {
        'content-type': 'application/json',
      },
      Http.ContentType.Json,
      new Uint8Array([
        123, 34, 100, 97, 116, 97, 49, 34, 58, 34, 112, 117, 116, 32, 109, 111,
        99, 107, 32, 100, 97, 116, 97, 49, 34, 44, 34, 100, 97, 116, 97, 50, 34,
        58, 34, 112, 117, 116, 32, 109, 111, 99, 107, 32, 100, 97, 116, 97, 50,
        34, 125,
      ]),
    )!;

    await SessionStorageAgent.putJson('PUT.status', resp.status as number);
    await SessionStorageAgent.putJson('PUT.headers', resp.headers);
    await SessionStorageAgent.putByteArray('PUT.body', resp.body);
  }

  async testHttpPatch() {
    const httpAgent = await HttpAgent?.acquire('test-http-server')!;

    const resp = await httpAgent.patch(
      '/resource/1',
      {
        'content-type': 'application/json',
      },
      Http.ContentType.Json,
      new Uint8Array([
        123, 34, 100, 97, 116, 97, 49, 34, 58, 34, 112, 117, 116, 32, 109, 111,
        99, 107, 32, 100, 97, 116, 97, 49, 34, 125,
      ]),
    )!;

    await SessionStorageAgent.putJson('PATCH.status', resp.status as number);
    await SessionStorageAgent.putJson('PATCH.headers', resp.headers);
    await SessionStorageAgent.putByteArray('PATCH.body', resp.body);
  }

  async testHttpDelete() {
    const httpAgent = await HttpAgent?.acquire('test-http-server')!;

    const resp = await httpAgent.delete(
      '/resource/1',
      {
        'content-type': 'application/json',
      },
      Http.ContentType.Json,
      new Uint8Array(),
    )!;

    await SessionStorageAgent.putJson('DELETE.status', resp.status as number);
    await SessionStorageAgent.putJson('DELETE.headers', resp.headers);
    await SessionStorageAgent.putByteArray('DELETE.body', resp.body);
  }
}
