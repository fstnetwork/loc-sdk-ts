import {
  FileStorageAgent,
  GenericLogic,
  Logic,
  LoggingAgent,
  RailwayError,
  SessionStorageAgent,
} from '@fstnetwork/logic';

@Logic()
export class TestFileStorage extends GenericLogic {
  async run() {
    LoggingAgent.info('test TestFileStorage');

    await this.testFtp();
    await this.testFilesystem();
  }

  async testFtp() {
    const ftpFileStorageAgent = await FileStorageAgent?.acquire(
      'test-ftp-server',
    )!;

    const urlOne = '/test_dir/test_file_1.txt';
    // data: "put to ftp server"
    const originDataOne = new Uint8Array([
      112, 117, 116, 32, 116, 111, 32, 102, 116, 112, 32, 115, 101, 114, 118,
      101, 114,
    ]);
    await ftpFileStorageAgent?.simplePut(urlOne, originDataOne);
    await SessionStorageAgent.putByteArray('originDataOne', originDataOne);
    const receivedDataOne = await ftpFileStorageAgent?.simpleGet(urlOne);
    await SessionStorageAgent.putByteArray('receivedDataOne', receivedDataOne);

    const urlTwo = '/test_dir/test_file_2.txt';
    // data: "this project is called saffron"
    const originDataTwo = new Uint8Array([
      116, 104, 105, 115, 32, 112, 114, 111, 106, 101, 99, 116, 32, 105, 115,
      32, 99, 97, 108, 108, 101, 100, 32, 115, 97, 102, 102, 114, 111, 110,
    ]);
    await ftpFileStorageAgent?.simplePut(urlTwo, originDataTwo);
    await SessionStorageAgent.putByteArray('originDataTwo', originDataTwo);
    const receivedDataTwo = await ftpFileStorageAgent?.simpleGet(urlTwo);
    await SessionStorageAgent.putByteArray('receivedDataTwo', receivedDataTwo);

    const urlThree = '/test_dir/test_file_3.txt';
    // data: "hello FST network"
    const originDataThree = new Uint8Array([
      104, 101, 108, 108, 111, 32, 70, 83, 84, 32, 110, 101, 116, 119, 111, 114,
      107,
    ]);
    await ftpFileStorageAgent?.simplePut(urlThree, originDataThree);
    await SessionStorageAgent.putByteArray('originDataThree', originDataThree);
    const receivedDataThree = await ftpFileStorageAgent?.simpleGet(urlThree);
    await SessionStorageAgent.putByteArray(
      'receivedDataThree',
      receivedDataThree,
    );
  }

  async testFilesystem() {
    const smbFileStorageAgent = await FileStorageAgent?.acquire(
      'test-smb-server',
    )!;

    let url = '/sharing/r_file.txt';
    let content = Deno.core.encode('write r_file.txt');
    await smbFileStorageAgent?.simplePut(url, content);

    let result = await smbFileStorageAgent?.simpleGet(url);
    await SessionStorageAgent.putByteArray('fileTestReceivedData', result);

    url = '/sharing/not_exist/r_file.txt';
    content = Deno.core.encode('write not_exist/r_file.txt');
    await smbFileStorageAgent?.simplePut(url, content, {
      ensureDir: true,
    });

    result = await smbFileStorageAgent?.simpleGet(url);
    await SessionStorageAgent.putByteArray('fileTestReceivedData2', result);

    url = '/sharing/not_exist/new_dir';
    await smbFileStorageAgent?.createDirAll(url);

    // NOTE: this is a mock response not a real test
    url = '/sharing/not_exist';
    const listResponse = await smbFileStorageAgent?.list(url);
    await SessionStorageAgent.putJson(
      'fileTestReceivedListResponse',
      listResponse,
    );

    url = '/sharing/not_exist/r_file.txt';
    await smbFileStorageAgent?.delete(url);
  }

  async handleError(error: RailwayError) {
    LoggingAgent.error(`${error}`);
  }
}
