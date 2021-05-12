import * as TYPES from './types';

export const setFirstName = (firstName) => ({
  type: TYPES.SET_FIRST_NAME,
  payload: firstName,
});

export const setLastName = (lastName) => ({
  type: TYPES.SET_LAST_NAME,
  payload: lastName,
});

export const setUsername = (username) => ({
  type: TYPES.SET_USERNAME,
  payload: username,
});

export const clearFilter = () => ({
  type: TYPES.CLEAR_FILTER,
});

export const setSelectedStudentUsername = (username) => ({
  type: TYPES.SET_SELECTED_STUDENT_USERNAME,
  payload: username,
});

export const setIsLoaded = (bool) => ({
  type: TYPES.SET_IS_LOADED,
  payload: bool,
});
