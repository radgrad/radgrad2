import {
  SET_CARD_EXPLORER_WIDGET_HIDDEN_COURSES,
  SET_CARD_EXPLORER_WIDGET_HIDDEN_OPPORTUNITIES,
} from '../actions/cardExporerPageActionTypes';

interface ICardExplorerPageStates {
  cardExplorerWidget?: {
    hiddenCourses: boolean,
    hiddenOpportunities: boolean,
  }
}

export function cardExplorerPageReducer(state: ICardExplorerPageStates = {}, action) {
  let otherKeys;
  let s: ICardExplorerPageStates;
  switch (action.type) {
    case SET_CARD_EXPLORER_WIDGET_HIDDEN_COURSES:
      otherKeys = state.cardExplorerWidget;
      s = {
        ...state,
        cardExplorerWidget: {
          ...otherKeys,
          hiddenCourses: action.payload,
        },
      };
      return s;
    case SET_CARD_EXPLORER_WIDGET_HIDDEN_OPPORTUNITIES:
      otherKeys = state.cardExplorerWidget;
      s = {
        ...state,
        cardExplorerWidget: {
          ...otherKeys,
          hiddenOpportunities: action.payload,
        },
      };
      return s;
    default:
      return state;
  }
}
