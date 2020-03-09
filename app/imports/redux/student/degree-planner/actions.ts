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

export const selectFavoriteOpportunitiesTab = () => ({
  type: TYPES.SELECT_FAVORITE_OPPORTUNITIES,
  selectedTab: TYPES.SELECT_FAVORITE_OPPORTUNITIES,
});

export const selectFavoritePlansTab = () => ({
  type: TYPES.SELECT_FAVORITE_PLANS,
  selectedTab: TYPES.SELECT_FAVORITE_PLANS,
});

export const selectFavoriteCoursesTab = () => ({
  type: TYPES.SELECT_FAVORITE_COURSES,
  selectedTab: TYPES.SELECT_FAVORITE_COURSES,
});

export const selectFavoriteDetailsTab = () => ({
  type: TYPES.SELECT_FAVORITE_DETAILS,
  selectedTab: TYPES.SELECT_FAVORITE_DETAILS,
});

export const selectGenericNotesTab = () => ({
  type: TYPES.SELECT_GENERIC_NOTES,
  selectedTab: TYPES.SELECT_GENERIC_NOTES,
});
