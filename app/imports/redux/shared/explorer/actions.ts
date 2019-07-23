import * as TYPES from './types';

export const setCardExplorerWidgetHiddenCourses = (hiddenCourses: boolean) => ({
  type: TYPES.SET_CARD_EXPLORER_WIDGET_HIDDEN_COURSES,
  payload: hiddenCourses,
});

export const setCardExplorerWidgetHiddenOpportunities = (hiddenOpportunities: boolean) => ({
  type: TYPES.SET_CARD_EXPLORER_WIDGET_HIDDEN_OPPORTUNITIES,
  payload: hiddenOpportunities,
});
