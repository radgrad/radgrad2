import {
  ADVISOR_HOME_SET_FIRST_NAME,
  ADVISOR_HOME_SET_LAST_NAME,
  ADVISOR_HOME_SET_USERNAME,
  ADVISOR_HOME_CLEAR_FILTER,
  ADVISOR_HOME_SET_SELECTED_STUDENT_USERNAME,
  ADVISOR_HOME_SET_IS_LOADED,
} from './pageAdvisorActionTypes';

export const advisorHomeSetFirstName = (firstName) => ({
  type: ADVISOR_HOME_SET_FIRST_NAME,
  payload: firstName,
});

export const advisorHomeSetLastName = (lastName) => ({
  type: ADVISOR_HOME_SET_LAST_NAME,
  payload: lastName,
});

export const advisorHomeSetUsername = (username) => ({
  type: ADVISOR_HOME_SET_USERNAME,
  payload: username,
});

export const advisorHomeClearFilter = () => ({
  type: ADVISOR_HOME_CLEAR_FILTER,
});

export const advisorHomeSetSelectedStudentUsername = (username) => ({
  type: ADVISOR_HOME_SET_SELECTED_STUDENT_USERNAME,
  payload: username,
});

export const advisorHomeSetIsLoaded = (bool) => ({
  type: ADVISOR_HOME_SET_IS_LOADED,
  payload: bool,
});
