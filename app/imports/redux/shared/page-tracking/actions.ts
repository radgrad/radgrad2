import * as TYPES from './types';
import { IPageInterestsCategoryTypes } from '../../../api/page-tracking/PageInterestsCategoryTypes';

interface IAction {
  type: string;
}

export interface ISetCategoryAction extends IAction {
  payload: IPageInterestsCategoryTypes;
}

export const setPageTrackingScoreboardMenuCategory = (category: IPageInterestsCategoryTypes): ISetCategoryAction => ({
  type: TYPES.SET_PAGE_TRACKING_SCOREBOARD_MENU_CATEGORY,
  payload: category,
});

export const setPageTrackingComparisonMenuCategory = (category: IPageInterestsCategoryTypes): ISetCategoryAction => ({
  type: TYPES.SET_PAGE_TRACKING_COMPARISON_MENU_CATEGORY,
  payload: category,
});
