import { IPagination } from '../../typings/radgrad';
import {
  SET_ACADEMIC_PLANS_SHOW_COUNT, SET_ACADEMIC_PLANS_SHOW_INDEX,
  SET_ACADEMIC_TERMS_SHOW_COUNT, SET_ACADEMIC_TERMS_SHOW_INDEX,
  SET_ACADEMIC_YEARS_SHOW_COUNT, SET_ACADEMIC_YEARS_SHOW_INDEX,
  SET_ADVISOR_LOGS_SHOW_COUNT, SET_ADVISOR_LOGS_SHOW_INDEX,
} from '../actions/paginationActionTypes';

export function paginationReducer(state: IPagination = {}, action) {
  // console.log('paginationReducer state=%o, action=%o', state, action);
  let collect;
  let s: IPagination;
  switch (action.type) {
    case SET_ACADEMIC_PLANS_SHOW_INDEX:
      collect = state.AcademicPlanCollection;
      s = {
        ...state,
        AcademicPlanCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_ACADEMIC_PLANS_SHOW_COUNT:
      collect = state.AcademicPlanCollection;
      s = {
        ...state,
        AcademicPlanCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_ACADEMIC_TERMS_SHOW_INDEX:
      collect = state.AcademicTermCollection;
      s = {
        ...state,
        AcademicTermCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_ACADEMIC_TERMS_SHOW_COUNT:
      collect = state.AcademicTermCollection;
      s = {
        ...state,
        AcademicTermCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_ACADEMIC_YEARS_SHOW_INDEX:
      collect = state.AcademicYearInstanceCollection;
      s = {
        ...state,
        AcademicYearInstanceCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_ACADEMIC_YEARS_SHOW_COUNT:
      collect = state.AcademicYearInstanceCollection;
      s = {
        ...state,
        AcademicYearInstanceCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    case SET_ADVISOR_LOGS_SHOW_INDEX:
      collect = state.AdvisorLogCollection;
      s = {
        ...state,
        AdvisorLogCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      return s;
    case SET_ADVISOR_LOGS_SHOW_COUNT:
      collect = state.AdvisorLogCollection;
      s = {
        ...state,
        AdvisorLogCollection: {
          ...collect,
          showCount: action.payload,
        },
      };
      return s;
    default:
      return state;
  }
}
