import * as TYPES from './types';
import {
  IPageInterestsCategoryTypes,
  PageInterestsCategoryTypes,
} from '../../../api/page-tracking/PageInterestsCategoryTypes';
import { ISetCategoryAction } from './actions';

interface IState {
  scoreboardMenuCategory: IPageInterestsCategoryTypes;
  comparisonMenuCategory: IPageInterestsCategoryTypes;
}

const initialState: IState = {
  scoreboardMenuCategory: PageInterestsCategoryTypes.INTEREST,
  comparisonMenuCategory: PageInterestsCategoryTypes.INTEREST,
};

function reducer(state: IState = initialState, action: ISetCategoryAction): IState {
  let s: IState;
  switch (action.type) {
    case TYPES.SET_PAGE_TRACKING_SCOREBOARD_MENU_CATEGORY:
      s = {
        ...state,
        scoreboardMenuCategory: action.payload,
      };
      return s;
    case TYPES.SET_PAGE_TRACKING_COMPARISON_MENU_CATEGORY:
      s = {
        ...state,
        comparisonMenuCategory: action.payload,
      };
      return s;
    default:
      return state;
  }
}

export default reducer;
