import { GenericLogic, Logic, RailwayError } from "@fstnetwork/logic";

@Logic()
export class TestFileStorage extends GenericLogic {
  async run() {
    this.context.agents.logging.info("test TestFileStorage");

    await this.testFtp();
    await this.testFilesystem();
  }

  async testFtp() {
    const ftpFileStorageAgent = await this.context.agents.fileStorage?.acquire(
      "test-ftp-server"
    )!;

    let urlOne = "/test_dir/test_file_1.txt";
    // data: "put to ftp server"
    let originDataOne = new Uint8Array([
      112, 117, 116, 32, 116, 111, 32, 102, 116, 112, 32, 115, 101, 114, 118,
      101, 114,
    ]);
    await ftpFileStorageAgent?.simplePut(urlOne, originDataOne);
    await this.context.agents.sessionStorage.putByteArray(
      "originDataOne",
      originDataOne
    );
    let receivedDataOne = await ftpFileStorageAgent?.simpleGet(urlOne);
    await this.context.agents.sessionStorage.putByteArray(
      "receivedDataOne",
      receivedDataOne!
    );

    let urlTwo = "/test_dir/test_file_2.txt";
    // data: "this project is called saffron"
    let originDataTwo = new Uint8Array([
      116, 104, 105, 115, 32, 112, 114, 111, 106, 101, 99, 116, 32, 105, 115,
      32, 99, 97, 108, 108, 101, 100, 32, 115, 97, 102, 102, 114, 111, 110,
    ]);
    await ftpFileStorageAgent?.simplePut(urlTwo, originDataTwo);
    await this.context.agents.sessionStorage.putByteArray(
      "originDataTwo",
      originDataTwo
    );
    let receivedDataTwo = await ftpFileStorageAgent?.simpleGet(urlTwo);
    await this.context.agents.sessionStorage.putByteArray(
      "receivedDataTwo",
      receivedDataTwo!
    );

    let urlThree = "/test_dir/test_file_3.txt";
    // data: "hello FST network"
    let originDataThree = new Uint8Array([
      104, 101, 108, 108, 111, 32, 70, 83, 84, 32, 110, 101, 116, 119, 111, 114,
      107,
    ]);
    await ftpFileStorageAgent?.simplePut(urlThree, originDataThree);
    await this.context.agents.sessionStorage.putByteArray(
      "originDataThree",
      originDataThree
    );
    let receivedDataThree = await ftpFileStorageAgent?.simpleGet(urlThree);
    await this.context.agents.sessionStorage.putByteArray(
      "receivedDataThree",
      receivedDataThree!
    );
  }

  async testFilesystem() {
    const smbFileStorageAgent = await this.context.agents.fileStorage?.acquire(
      "test-smb-server"
    )!;

    let url = "/sharing/r_file.txt";
    let content = Deno.core.encode(`write r_file.txt`);
    await smbFileStorageAgent?.simplePut(url, content);

    let result = await smbFileStorageAgent?.simpleGet(url);
    await this.context.agents.sessionStorage.putByteArray(
      "fileTestReceivedData",
      result!
    );

    url = "/sharing/not_exist/r_file.txt";
    content = Deno.core.encode(`write not_exist/r_file.txt`);
    await smbFileStorageAgent?.simplePut(url, content, {
      ensureDir: true,
    });

    result = await smbFileStorageAgent?.simpleGet(url);
    await this.context.agents.sessionStorage.putByteArray(
      "fileTestReceivedData2",
      result!
    );

    url = "/sharing/not_exist/new_dir";
    await smbFileStorageAgent?.createDirAll(url);

    // NOTE: this is a mock response not a real test
    url = "/sharing/not_exist";
    const listResponse = await smbFileStorageAgent?.list(url);
    await this.context.agents.sessionStorage.putJson(
      "fileTestReceivedListResponse",
      listResponse
    );

    url = "/sharing/not_exist/r_file.txt";
    await smbFileStorageAgent?.delete(url);
  }

  async handleError(error: RailwayError) {
    this.context.agents.logging.error(`${error}`);
  }
}
