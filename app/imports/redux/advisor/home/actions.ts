import * as TYPES from './types';

export const advisorHomeSetFirstName = (firstName) => ({
  type: TYPES.ADVISOR_HOME_SET_FIRST_NAME,
  payload: firstName,
});

export const advisorHomeSetLastName = (lastName) => ({
  type: TYPES.ADVISOR_HOME_SET_LAST_NAME,
  payload: lastName,
});

export const advisorHomeSetUsername = (username) => ({
  type: TYPES.ADVISOR_HOME_SET_USERNAME,
  payload: username,
});

export const advisorHomeClearFilter = () => ({
  type: TYPES.ADVISOR_HOME_CLEAR_FILTER,
});

export const advisorHomeSetSelectedStudentUsername = (username) => ({
  type: TYPES.ADVISOR_HOME_SET_SELECTED_STUDENT_USERNAME,
  payload: username,
});

export const advisorHomeSetIsLoaded = (bool) => ({
  type: TYPES.ADVISOR_HOME_SET_IS_LOADED,
  payload: bool,
});
