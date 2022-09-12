import { Task } from "../primitive";

import { Payload } from "../types/payload";

export abstract class AbstractContext {
  #payload?: Payload;
  #task?: Task;

  async payload(): Promise<Payload> {
    if (this.#payload === undefined) {
      this.#payload = await initializePayload();
    }
    return this.#payload;
  }

  get task(): Task {
    if (this.#task === undefined) {
      this.#task = initializeTask();
    }
    return this.#task;
  }
}

async function initializePayload(): Promise<Payload> {
  const payload = await Deno.core.opAsync("op_initialize_payload");
  if ("http" in payload) {
    payload.http.body = Uint8Array.from(atob(payload.http.body), (c) =>
      c.charCodeAt(0)
    );
  }

  if ("messageQueue" in payload) {
    payload.messageQueue.data = Uint8Array.from(
      atob(payload.messageQueue.data),
      (c) => c.charCodeAt(0)
    );
  }

  return payload;
}

function initializeTask(): Task {
  return Deno.core.opSync("op_initialize_task");
}
