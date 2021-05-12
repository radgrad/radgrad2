import * as TYPES from './types';

export const startCheckIntegrity = () => ({
  type: TYPES.CHECK_INTEGRITY_WORKING,
  payload: true,
});

export const checkIntegrityDone = () => ({
  type: TYPES.CHECK_INTEGRITY_DONE,
  payload: false,
});

export const startDumpDatabase = () => ({
  type: TYPES.DUMP_DATABASE_WORKING,
  payload: true,
});

export const dumpDatabaseDone = () => ({
  type: TYPES.DUMP_DATABASE_DONE,
  payload: false,
});
