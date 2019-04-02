import { IPagination } from '../../typings/radgrad';
import { SET_ACADEMIC_TERMS_SHOW_COUNT, SET_ACADEMIC_TERMS_SHOW_INDEX } from '../actions/paginationActionTypes';

export function paginationReducer(state: IPagination = {}, action) {
  // console.log('pagination state=%o, action=%o', state, action);
  switch (action.type) {
    case SET_ACADEMIC_TERMS_SHOW_INDEX:
      let collect = state.AcademicTermCollection;
      let s = {
        ...state,
        AcademicTermCollection: {
          ...collect,
          showIndex: action.payload,
        },
      };
      // console.log('paginationReducer new state=%o', s);
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
      // console.log('paginationReducer new state=%o', s);
      return s;
    default:
      return state;
  }
}

