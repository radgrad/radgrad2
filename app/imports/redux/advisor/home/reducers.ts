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
    case TYPES.SET_FIRST_NAME:
      return {
        ...state,
        firstName: action.payload,

      };
    case TYPES.SET_LAST_NAME:
      return {
        ...state,
        lastName: action.payload,

      };
    case TYPES.SET_USERNAME:
      return {
        ...state,
        username: action.payload,

      };
    case TYPES.CLEAR_FILTER:
      return {
        ...state,
        firstName: '',
        lastName: '',
        username: '',

      };
    case TYPES.SET_SELECTED_STUDENT_USERNAME:
      return {
        ...state,
        selectedUsername: action.payload,
        isLoaded: false,

      };
    case TYPES.SET_IS_LOADED:
      return {
        ...state,
        isLoaded: action.payload,
      };

    default:
      return state;
  }

}

export default reducer;
