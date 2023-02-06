import { VersionedIdentityContext } from '../types/event';

export interface Task {
  taskId: TaskKey;
  startTimestamp: Date;
  dataProcess: VersionedIdentityContext;
  currentLogic?: VersionedIdentityContext;
  executedLogics: VersionedIdentityContext[];
}

export interface TaskKey {
  executionId: string;
  taskId: string;
}
