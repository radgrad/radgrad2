/* The actions */

import { SELECT_COURSE, SELECT_COURSE_INSTANCE, SELECT_OPPORTUNITY, SELECT_OPPORTUNITY_INSTANCE, DepSelectedTabs } from './actionTypes';

export const selectCourse = (courseID) => ({
  type: SELECT_COURSE,
  payload: courseID,
});

export const selectCourseInstance = (courseInstanceID) => ({
  type: SELECT_COURSE_INSTANCE,
  payload: courseInstanceID,
});

export const selectOpportunity = (opportunityID) => ({
  type: SELECT_OPPORTUNITY,
  payload: opportunityID,
});

export const selectOpportunityInstance = (opportunityInstanceID) => ({
  type: SELECT_OPPORTUNITY_INSTANCE,
  payload: opportunityInstanceID,
});

export const selectPlanTab = () => ({
  type: DepSelectedTabs.SELECT_PLAN,
  selectedTab: DepSelectedTabs.SELECT_PLAN,
});

export const selectInspectorTab = () => ({
  type: DepSelectedTabs.SELECT_INSPECTOR,
  selectedTab: DepSelectedTabs.SELECT_INSPECTOR,
});
