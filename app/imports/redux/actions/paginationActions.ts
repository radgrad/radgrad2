import {
  SET_ACADEMIC_PLANS_SHOW_COUNT,
  SET_ACADEMIC_PLANS_SHOW_INDEX,
  SET_ACADEMIC_TERMS_SHOW_COUNT,
  SET_ACADEMIC_TERMS_SHOW_INDEX,
  SET_ACADEMIC_YEARS_SHOW_COUNT,
  SET_ACADEMIC_YEARS_SHOW_INDEX,
} from './paginationActionTypes';

export const setAcademicPlansShowCount = (count) => ({
  type: SET_ACADEMIC_PLANS_SHOW_COUNT,
  payload: count,
});

export const setAcademicPlansShowIndex = (index) => ({
  type: SET_ACADEMIC_PLANS_SHOW_INDEX,
  payload: index,
});

export const setAcademicTermsShowCount = (count) => ({
  type: SET_ACADEMIC_TERMS_SHOW_COUNT,
  payload: count,
});

export const setAcademicTermsShowIndex = (index) => ({
  type: SET_ACADEMIC_TERMS_SHOW_INDEX,
  payload: index,
});

export const setAcademicYearsShowCount = (count) => ({
  type: SET_ACADEMIC_YEARS_SHOW_COUNT,
  payload: count,
});

export const setAcademicYearsShowIndex = (index) => ({
  type: SET_ACADEMIC_YEARS_SHOW_INDEX,
  payload: index,
});
