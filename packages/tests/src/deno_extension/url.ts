import {
  GenericLogic,
  Logic,
  LoggingAgent,
  RailwayError,
  SessionStorageAgent,
} from '@fstnetwork/logic';

@Logic()
export default class TestUrl extends GenericLogic {
  async run() {
    LoggingAgent.info('test TestUrl');

    const baseURL = new URL('https://fst.dev');
    await SessionStorageAgent.putString('baseURL_href', baseURL.href);

    const withPath = new URL('/fst-quick-start/', baseURL);
    await SessionStorageAgent.putString('withPath_href', withPath.href);
    await SessionStorageAgent.putString('withPath_protocol', withPath.protocol);
    await SessionStorageAgent.putString('withPath_host', withPath.host);

    const searchParams = new URLSearchParams('a=Apple&b=Banana');
    await SessionStorageAgent.putString(
      'searchParams_a',
      searchParams.get('a') as string
    );
    searchParams.append('c', 'California');
    await SessionStorageAgent.putString(
      'searchParams_c',
      searchParams.get('c') as string
    );
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
