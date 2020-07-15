import * as TYPES from './types';

interface IAction {
  type: string;
}

interface ISetExplorerScrollPositionAction extends IAction {
  payload: number;
}

export const setExplorerPlansScrollPosition = (scrollPosition: number): ISetExplorerScrollPositionAction => ({
  type: TYPES.SET_EXPLORER_PLANS_SCROLL_POSITION,
  payload: scrollPosition,
});

export const setExplorerCareerGoalsScrollPosition = (scrollPosition: number): ISetExplorerScrollPositionAction => ({
  type: TYPES.SET_EXPLORER_CAREERGOALS_SCROLL_POSITION,
  payload: scrollPosition,
});

export const setExplorerCoursesScrollPosition = (scrollPosition: number): ISetExplorerScrollPositionAction => ({
  type: TYPES.SET_EXPLORER_COURSES_SCROLL_POSITION,
  payload: scrollPosition,
});

export const setExplorerDegreesScrollPosition = (scrollPosition: number): ISetExplorerScrollPositionAction => ({
  type: TYPES.SET_EXPLORER_DEGREES_SCROLL_POSITION,
  payload: scrollPosition,
});

export const setExplorerInterestsScrollPosition = (scrollPosition: number): ISetExplorerScrollPositionAction => ({
  type: TYPES.SET_EXPLORER_INTERESTS_SCROLL_POSITION,
  payload: scrollPosition,
});

export const setExplorerOpportunitiesScrollPosition = (scrollPosition: number): ISetExplorerScrollPositionAction => ({
  type: TYPES.SET_EXPLORER_OPPORTUNITIES_SCROLL_POSITION,
  payload: scrollPosition,
});
