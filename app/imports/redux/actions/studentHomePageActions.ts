import {
  SET_STUDENT_HOME_WIDGET_HIDDEN_COURSES,
  SET_STUDENT_HOME_WIDGET_HIDDEN_OPPORTUNITIES,
} from './studentHomePageActionTypes';

export const setStudentHomeWidgetHiddenCourses = (hiddenCourses: boolean) => ({
  type: SET_STUDENT_HOME_WIDGET_HIDDEN_COURSES,
  payload: hiddenCourses,
});

export const setStudentHomeWidgetHiddenOpportunities = (hiddenOpportunities: boolean) => ({
  type: SET_STUDENT_HOME_WIDGET_HIDDEN_OPPORTUNITIES,
  payload: hiddenOpportunities,
});
