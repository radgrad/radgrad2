import * as TYPES from './types';

export const selectCourse = (courseID) => ({
  type: TYPES.SELECT_COURSE,
  payload: courseID,
});

export const selectCourseInstance = (courseInstanceID) => ({
  type: TYPES.SELECT_COURSE_INSTANCE,
  payload: courseInstanceID,
});

export const selectOpportunity = (opportunityID) => ({
  type: TYPES.SELECT_OPPORTUNITY,
  payload: opportunityID,
});

export const selectOpportunityInstance = (opportunityInstanceID) => ({
  type: TYPES.SELECT_OPPORTUNITY_INSTANCE,
  payload: opportunityInstanceID,
});

export const selectPlanTab = () => ({
  type: TYPES.SELECT_PLAN,
  selectedTab: TYPES.SELECT_PLAN,
});

export const selectInspectorTab = () => ({
  type: TYPES.SELECT_INSPECTOR,
  selectedTab: TYPES.SELECT_INSPECTOR,
});
