import * as TYPES from './types';

const initialState = {
  firstName: '',
  lastName: '',
  username: '',
  selectedUsername: '',
  isLoaded: false,
};

function reducer(state: any = initialState, action) {
  switch (action.type) {
    case TYPES.ADVISOR_HOME_SET_FIRST_NAME:
      return {
        ...state,
        firstName: action.payload,

      };
    case TYPES.ADVISOR_HOME_SET_LAST_NAME:
      return {
        ...state,
        lastName: action.payload,

      };
    case TYPES.ADVISOR_HOME_SET_USERNAME:
      return {
        ...state,
        username: action.payload,

      };
    case TYPES.ADVISOR_HOME_CLEAR_FILTER:
      return {
        ...state,
        firstName: '',
        lastName: '',
        username: '',

      };
    case TYPES.ADVISOR_HOME_SET_SELECTED_STUDENT_USERNAME:
      return {
        ...state,
        selectedUsername: action.payload,
        isLoaded: false,

      };
    case TYPES.ADVISOR_HOME_SET_IS_LOADED:
      return {
        ...state,
        isLoaded: action.payload,
      };

    default:
      return state;
  }

}

export default reducer;
