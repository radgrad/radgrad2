import * as TYPES from './types';

export interface DatabaseAction {
  type: string;
  payload: boolean;
}

export const startCheckIntegrity = (): DatabaseAction => ({
  type: TYPES.CHECK_INTEGRITY_WORKING,
  payload: true,
});

export const checkIntegrityDone = (): DatabaseAction => ({
  type: TYPES.CHECK_INTEGRITY_DONE,
  payload: false,
});

export const startDumpDatabase = (): DatabaseAction => ({
  type: TYPES.DUMP_DATABASE_WORKING,
  payload: true,
});

export const dumpDatabaseDone = (): DatabaseAction => ({
  type: TYPES.DUMP_DATABASE_DONE,
  payload: false,
});
