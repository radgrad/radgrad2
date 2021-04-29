import { EXPLORER_TYPE } from '../../../ui/layouts/utilities/route-constants';
import * as TYPES from './types';

export const setShowIndex = (explorerType: string, index: number): { type?: string, payload?: number } => {
  const retVal: { type?: string, payload?: number } = {};
  retVal.payload = index;
  switch (explorerType) {
    case EXPLORER_TYPE.OPPORTUNITIES:
      retVal.type = TYPES.SET_OPPORTUNITIES_SHOW_INDEX;
      break;
    default:
      break;
  }
  return retVal;
};

export const setOpportunitiesSortValue = (explorerType: string, value: string): { type?: string, payload?: string } => {
  const retVal: { type?: string, payload?: string } = {};
  retVal.payload = value;
  switch (explorerType) {
    case EXPLORER_TYPE.OPPORTUNITIES:
      retVal.type = TYPES.SET_OPPORTUNITIES_SORT_VALUE;
      break;
    default:
      break;
  }
  return retVal;
};

export const setSortValue = (explorerType: string, value: string): { type?: string, payload?: string } => {
  const retVal: { type?: string, payload?: string } = {};
  retVal.payload = value;
  switch (explorerType) {
    case EXPLORER_TYPE.CAREERGOALS:
      retVal.type = TYPES.SET_CAREERGOALS_SORT_VALUE;
      break;
    case EXPLORER_TYPE.INTERESTS:
      retVal.type = TYPES.SET_INTERESTS_SORT_VALUE;
      break;
    case EXPLORER_TYPE.OPPORTUNITIES:
      retVal.type = TYPES.SET_OPPORTUNITIES_SORT_VALUE;
      break;
    default:
      break;
  }
  return retVal;
};

export const setFilterValue = (explorerType: string, value: string): { type?: string, payload?: string } => {
  const retVal: { type?: string, payload?: string } = {};
  retVal.payload = value;
  switch (explorerType) {
    case EXPLORER_TYPE.CAREERGOALS:
      retVal.type = TYPES.SET_CAREERGOALS_FILTER_VALUE;
      break;
    case EXPLORER_TYPE.INTERESTS:
      retVal.type = TYPES.SET_INTERESTS_FILTER_VALUE;
      break;
    case EXPLORER_TYPE.COURSES:
      retVal.type = TYPES.SET_COURSES_FILTER_VALUE;
      break;
    default:
      break;
  }
  return retVal;
};
