import {
  SET_CARD_EXPLORER_WIDGET_HIDDEN_COURSES,
  SET_CARD_EXPLORER_WIDGET_HIDDEN_OPPORTUNITIES,
} from './cardExporerPageActionTypes';

export const setCardExplorerWidgetHiddenCourses = (hiddenCourses: boolean) => ({
  type: SET_CARD_EXPLORER_WIDGET_HIDDEN_COURSES,
  payload: hiddenCourses,
});

export const setCardExplorerWidgetHiddenOpportunities = (hiddenOpportunities: boolean) => ({
  type: SET_CARD_EXPLORER_WIDGET_HIDDEN_OPPORTUNITIES,
  payload: hiddenOpportunities,
});
