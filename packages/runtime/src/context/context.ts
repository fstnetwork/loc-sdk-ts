import { Task } from "../primitive";

import { Payload } from "../types/payload";

export abstract class AbstractContext {
  #payload?: Payload;
  #task?: Task;

  get payload() {
    if (this.#payload === undefined) {
      this.#payload = initializePayload();
    }
    return this.#payload;
  }

  get task() {
    if (this.#task === undefined) {
      this.#task = initializeTask();
    }
    return this.#task;
  }
}

function initializePayload(): Payload {
  const payload = Deno.core.opSync("op_initialize_payload");
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
