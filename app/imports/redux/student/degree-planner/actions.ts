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

export const selectFavoriteOpportunitiesTab = (): SelectTab => ({
  type: TYPES.SELECT_FAVORITE_OPPORTUNITIES,
  selectedTab: TYPES.SELECT_FAVORITE_OPPORTUNITIES,
});

export const selectFavoritePlansTab = (): SelectTab => ({
  type: TYPES.SELECT_FAVORITE_PLANS,
  selectedTab: TYPES.SELECT_FAVORITE_PLANS,
});

export const selectFavoriteCoursesTab = (): SelectTab => ({
  type: TYPES.SELECT_FAVORITE_COURSES,
  selectedTab: TYPES.SELECT_FAVORITE_COURSES,
});

export const selectFavoriteDetailsTab = (): SelectTab => ({
  type: TYPES.SELECT_FAVORITE_DETAILS,
  selectedTab: TYPES.SELECT_FAVORITE_DETAILS,
});
