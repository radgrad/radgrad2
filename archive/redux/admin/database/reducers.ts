import * as TYPES from './types';

const initialState = {
  checkIntegrity: false,
  dumpDatabase: false,
};

const reducer = (state: any = initialState, action) => {
  switch (action.type) {
    case TYPES.CHECK_INTEGRITY_WORKING:
      return {
        ...state,
        checkIntegrity: true,
      };
    case TYPES.CHECK_INTEGRITY_DONE:
      return {
        ...state,
        checkIntegrity: false,
      };
    case TYPES.DUMP_DATABASE_WORKING:
      return {
        ...state,
        dumpDatabase: true,
      };
    case TYPES.DUMP_DATABASE_DONE:
      return {
        ...state,
        dumpDatabase: false,
      };
    default:
      return state;
  }
};

export default reducer;
