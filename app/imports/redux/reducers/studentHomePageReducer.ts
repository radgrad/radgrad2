import {
  SET_STUDENT_HOME_WIDGET_HIDDEN,
} from '../actions/studentHomePageActionTypes';

interface IStudentHomePageStates {
  studentOfInterestWidget?: {
    hidden: boolean,
  }
}

export function studentHomePageReducer(state: IStudentHomePageStates = {}, action) {
  let otherKeys;
  let s: IStudentHomePageStates;
  switch (action.type) {
    case SET_STUDENT_HOME_WIDGET_HIDDEN:
      otherKeys = state.studentOfInterestWidget;
      s = {
        ...state,
        studentOfInterestWidget: {
          ...otherKeys,
          hidden: action.payload,
        },
      };
      return s;
    default:
      return state;
  }
}
