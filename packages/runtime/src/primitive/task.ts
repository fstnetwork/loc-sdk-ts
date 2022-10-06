import { IdentityContext } from '../types/event';

export interface Task {
  // NOTE: let `taskId` match the current response, need to discuss the better design and interface change.
  taskId: TaskId
  startAt: Date
  dataProcess: IdentityContext
  currentLogic?: IdentityContext
  executedLogics: IdentityContext[]
}

export interface TaskId {
  id: string
  executionId: string
}
