import * as TYPES from './types';

interface Action {
  type: string;
}

interface SetExplorerScrollPositionAction extends Action {
  payload: number;
}

export const setExplorerPlansScrollPosition = (scrollPosition: number): SetExplorerScrollPositionAction => ({
  type: TYPES.SET_EXPLORER_PLANS_SCROLL_POSITION,
  payload: scrollPosition,
});

export const setExplorerCareerGoalsScrollPosition = (scrollPosition: number): SetExplorerScrollPositionAction => ({
  type: TYPES.SET_EXPLORER_CAREERGOALS_SCROLL_POSITION,
  payload: scrollPosition,
});

export const setExplorerCoursesScrollPosition = (scrollPosition: number): SetExplorerScrollPositionAction => ({
  type: TYPES.SET_EXPLORER_COURSES_SCROLL_POSITION,
  payload: scrollPosition,
});

export const setExplorerInterestsScrollPosition = (scrollPosition: number): SetExplorerScrollPositionAction => ({
  type: TYPES.SET_EXPLORER_INTERESTS_SCROLL_POSITION,
  payload: scrollPosition,
});

export const setExplorerOpportunitiesScrollPosition = (scrollPosition: number): SetExplorerScrollPositionAction => ({
  type: TYPES.SET_EXPLORER_OPPORTUNITIES_SCROLL_POSITION,
  payload: scrollPosition,
});
