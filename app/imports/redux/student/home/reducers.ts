import * as TYPES from './types';

const initialState = {
  hiddenCourses: true,
  hiddenOpportunities: true,
};

function reducer(state: any = initialState, action) {
  let s;
  switch (action.type) {
    case TYPES.SET_WIDGET_HIDDEN_COURSES:
      s = {
        ...state,
        hiddenCourses: action.payload,
      };
      return s;
    case TYPES.SET_WIDGET_HIDDEN_OPPORTUNITIES:
      s = {
        ...state,
        hiddenOpportunities: action.payload,
      };
      return s;
    default:
      return state;
  }
}

export default reducer;
