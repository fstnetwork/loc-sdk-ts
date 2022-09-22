export const FileStorageAgent = {
  async acquire(configurationName: string): Promise<FileStorageAgentClient> {
    const configurationId = await Deno.core.opAsync(
      "op_file_storage_agent_acquire",
      configurationName
    );

    return new FileStorageAgentClient(configurationId);
  },
};

export class FileStorageAgentClient {
  constructor(readonly configurationId?: string) {}

  // TODO: consider to apply zero-copy buffer
  async simpleGet(path: string): Promise<Uint8Array> {
    return Deno.core.opAsync("op_file_storage_agent_simple_get", {
      configurationId: this.configurationId,
      path,
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
        configurationId: this.configurationId,
        path,
        ensureDir: options?.ensureDir ?? false,
      },
      byteArray
    );
  }

  async delete(path: string): Promise<void> {
    return Deno.core.opAsync("op_file_storage_agent_delete", {
      configurationId: this.configurationId,
      path,
    });
  }

  async list(path: string): Promise<Array<FileStorage.FileType>> {
    return Deno.core.opAsync("op_file_storage_agent_list", {
      configurationId: this.configurationId,
      path,
    });
  }

  async createDirAll(path: string): Promise<void> {
    return Deno.core.opAsync("op_file_storage_agent_create_dir_all", {
      configurationId: this.configurationId,
      path,
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
