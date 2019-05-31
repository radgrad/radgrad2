import {
  SET_STUDENT_HOME_WIDGET_HIDDEN_COURSES,
  SET_STUDENT_HOME_WIDGET_HIDDEN_OPPORTUNITIES,
} from '../actions/studentHomePageActionTypes';

interface IStudentHomePageStates {
  studentOfInterestWidget?: {
    hiddenCourses: boolean,
    hiddenOpportunities: boolean,
  }
}

export function studentHomePageReducer(state: IStudentHomePageStates = {}, action) {
  let otherKeys;
  let s: IStudentHomePageStates;
  switch (action.type) {
    case SET_STUDENT_HOME_WIDGET_HIDDEN_COURSES:
      otherKeys = state.studentOfInterestWidget;
      s = {
        ...state,
        studentOfInterestWidget: {
          ...otherKeys,
          hiddenCourses: action.payload,
        },
      };
      return s;
    case SET_STUDENT_HOME_WIDGET_HIDDEN_OPPORTUNITIES:
      otherKeys = state.studentOfInterestWidget;
      s = {
        ...state,
        studentOfInterestWidget: {
          ...otherKeys,
          hiddenOpportunities: action.payload,
        },
      };
      return s;
    default:
      return state;
  }
}
