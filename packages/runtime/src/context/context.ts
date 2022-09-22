import { Task } from "../primitive";

import { Payload } from "../types/payload";

export abstract class AbstractContext {
  #payload?: Payload;
  #task?: Task;

  async payload(): Promise<Payload> {
    if (this.#payload === undefined) {
      this.#payload = await fetchPayload();
    }
    return this.#payload;
  }

  get task(): Task {
    if (this.#task === undefined) {
      this.#task = fetchTask();
    }
    return this.#task;
  }
}

async function fetchPayload(): Promise<Payload> {
  return Deno.core.opAsync("op_fetch_payload");
}

function fetchTask(): Task {
  return Deno.core.opSync("op_fetch_task");
}
