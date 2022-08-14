export class FileStorageAgent {
  constructor(readonly configurationId?: string) {}

  async acquire(configurationName: string): Promise<FileStorageAgent> {
    const configurationId = await Deno.core.opAsync(
      "op_file_storage_agent_acquire",
      configurationName
    );

    return new FileStorageAgent(configurationId);
  }

  // TODO: consider to apply zero-copy buffer
  async simpleGet(path: string): Promise<Uint8Array> {
    return Deno.core.opAsync("op_file_storage_agent_simple_get", {
      path,
      configurationId: this.configurationId,
    });
  }

  async simplePut(
    path: string,
    data: Uint8Array | string,
    options?: FileStorage.PutOptions
  ): Promise<number> {
    const byteArray: Uint8Array =
      typeof data === "string" ? Deno.core.encode(data) : data;

    return Deno.core.opAsync(
      "op_file_storage_agent_simple_put",
      {
        path,
        ensureDir: options?.ensureDir ?? false,
        configurationId: this.configurationId,
      },
      byteArray
    );
  }

  async delete(path: string): Promise<void> {
    return Deno.core.opAsync("op_file_storage_agent_delete", {
      path,
      configurationId: this.configurationId,
    });
  }

  async list(path: string): Promise<Array<FileStorage.FileType>> {
    return Deno.core.opAsync("op_file_storage_agent_list", {
      path,
      configurationId: this.configurationId,
    });
  }

  async createDirAll(path: string): Promise<void> {
    return Deno.core.opAsync("op_file_storage_agent_create_dir_all", {
      path,
      configurationId: this.configurationId,
    });
  }
}

export namespace FileStorage {
  export interface FileType {
    type: "file" | "directory" | "symbolicLink";
    name: string;
  }

  export interface PutOptions {
    ensureDir?: boolean;
  }
}
