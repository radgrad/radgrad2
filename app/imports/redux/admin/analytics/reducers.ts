import * as TYPES from './types';

const initialState = {
  getStudentEmails: false,
  testNewsletter: false,
  levelNewsletter: false,
  allNewsletter: false,
};

function reducer(state: any = initialState, action) {
  switch (action.type) {
    case TYPES.GET_EMAILS_WORKING:
      return {
        ...state,
        getStudentEmails: true,
      };
    case TYPES.GET_EMAILS_DONE:
      return {
        ...state,
        getStudentEmails: false,
      };
    case TYPES.TEST_EMAIL_WORKING:
      return {
        ...state,
        testNewsletter: true,
      };
    case TYPES.TEST_EMAIL_DONE:
      return {
        ...state,
        testNewsletter: false,
      };
    case TYPES.LEVEL_EMAIL_WORKING:
      return {
        ...state,
        levelNewsletter: true,
      };
    case TYPES.LEVEL_EMAIL_DONE:
      return {
        ...state,
        levelNewsletter: false,
      };
    case TYPES.ALL_EMAIL_WORKING:
      return {
        ...state,
        allNewsletter: true,
      };
    case TYPES.ALL_EMAIL_DONE:
      return {
        ...state,
        allNewsletter: false,
      };
    default:
      return state;
  }
}

export default reducer;
