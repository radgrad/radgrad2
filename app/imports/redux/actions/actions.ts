/* The actions */

import {
  SELECT_COURSE,
  SELECT_COURSE_INSTANCE,
  SELECT_OPPORTUNITY,
  SELECT_OPPORTUNITY_INSTANCE,
  CHECK_INTEGRITY_WORKING,
  CHECK_INTEGRITY_DONE,
  DUMP_DATABASE_WORKING,
  DUMP_DATABASE_DONE,
  GET_EMAILS_WORKING,
  GET_EMAILS_DONE,
  DepSelectedTabs,
} from './actionTypes';

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

export const startCheckIntegrity = () => ({
  type: CHECK_INTEGRITY_WORKING,
  payload: true,
});

export const checkIntegrityDone = () => ({
  type: CHECK_INTEGRITY_DONE,
  payload: false,
});

export const startDumpDatabase = () => ({
  type: DUMP_DATABASE_WORKING,
  payload: true,
});

export const dumpDatabaseDone = () => ({
  type: DUMP_DATABASE_DONE,
  payload: false,
});

export const startGetStudentEmails = () => ({
  type: GET_EMAILS_WORKING,
  payload: true,
});

export const getStudentEmailsDone = () => ({
  type: GET_EMAILS_DONE,
  payload: false,
});
