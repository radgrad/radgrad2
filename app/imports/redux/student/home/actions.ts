import * as TYPES from './types';

export const setStudentHomeWidgetHiddenCourses = (hiddenCourses: boolean) => ({
  type: TYPES.SET_STUDENT_HOME_WIDGET_HIDDEN_COURSES,
  payload: hiddenCourses,
});

export const setStudentHomeWidgetHiddenOpportunities = (hiddenOpportunities: boolean) => ({
  type: TYPES.SET_STUDENT_HOME_WIDGET_HIDDEN_OPPORTUNITIES,
  payload: hiddenOpportunities,
});
