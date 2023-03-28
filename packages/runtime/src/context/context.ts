import { Task } from '../primitive';

import { Payload } from '../types/payload';

export default abstract class AbstractContext {
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
  return Deno.core.opAsync('op_fetch_payload');
}

function fetchTask(): Task {
  const task = Deno.core.ops['op_fetch_task']?.();

  // NOTE: compatible with older versions, these field will be removed in the future
  task.taskId = {
    id: task.taskKey.taskId,
    executionId: task.taskKey.executionId,
  };
  task.startAt = task.startTimestamp;

  return task;
}
