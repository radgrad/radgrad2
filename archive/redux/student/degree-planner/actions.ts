import * as TYPES from './types';

export type SelectPayload = { type: string, payload: string };

export const selectCourse = (courseID: string): SelectPayload => ({
  type: TYPES.SELECT_COURSE,
  payload: courseID,
});

export const selectCourseInstance = (courseInstanceID: string): SelectPayload => ({
  type: TYPES.SELECT_COURSE_INSTANCE,
  payload: courseInstanceID,
});

export const selectOpportunity = (opportunityID: string): SelectPayload => ({
  type: TYPES.SELECT_OPPORTUNITY,
  payload: opportunityID,
});

export const selectOpportunityInstance = (opportunityInstanceID: string): SelectPayload => ({
  type: TYPES.SELECT_OPPORTUNITY_INSTANCE,
  payload: opportunityInstanceID,
});

export type SelectTab = { type: string, selectedTab: string };

export const selectPlanTab = (): SelectTab => ({
  type: TYPES.SELECT_PLAN,
  selectedTab: TYPES.SELECT_PLAN,
});

export const selectInspectorTab = (): SelectTab => ({
  type: TYPES.SELECT_INSPECTOR,
  selectedTab: TYPES.SELECT_INSPECTOR,
});

export const selectProfileOpportunitiesTab = (): SelectTab => ({
  type: TYPES.SELECT_PROFILE_OPPORTUNITIES,
  selectedTab: TYPES.SELECT_PROFILE_OPPORTUNITIES,
});

export const selectProfileCoursesTab = (): SelectTab => ({
  type: TYPES.SELECT_PROFILE_COURSES,
  selectedTab: TYPES.SELECT_PROFILE_COURSES,
});

export const selectProfileDetailsTab = (): SelectTab => ({
  type: TYPES.SELECT_PROFILE_DETAILS,
  selectedTab: TYPES.SELECT_PROFILE_DETAILS,
});
