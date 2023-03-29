import { VersionedIdentityContext } from '../types/event';

export interface Task {
  taskKey: TaskKey;
  startTimestamp: Date;
  dataProcess: VersionedIdentityContext;
  currentLogic?: VersionedIdentityContext;
  executedLogics: VersionedIdentityContext[];
}

export interface TaskKey {
  executionId: string;
  taskId: string;
}
