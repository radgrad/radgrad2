import * as TYPES from './types';

interface State {
  explorer: IExplorerState;
}

type IExplorerState = {
  plans: number;
  careerGoals: number;
  courses: number;
  interests: number;
  opportunities: number;
};

// Currently the scrollPosition supported and numbers assigned represent the Y-coordinates (scrollTop)
const initialState: State = {
  explorer: {
    plans: 0,
    careerGoals: 0,
    courses: 0,
    interests: 0,
    opportunities: 0,
  },
};

const reducer = (state: State = initialState, action: { [props: string]: any }): State => {
  let s: State;
  const otherExplorerKeys: IExplorerState = state.explorer;
  switch (action.type) {
    case TYPES.SET_EXPLORER_PLANS_SCROLL_POSITION:
      s = {
        ...state,
        explorer: {
          ...otherExplorerKeys,
          plans: action.payload,
        },
      };
      return s;
    case TYPES.SET_EXPLORER_CAREERGOALS_SCROLL_POSITION:
      s = {
        ...state,
        explorer: {
          ...otherExplorerKeys,
          careerGoals: action.payload,
        },
      };
      return s;
    case TYPES.SET_EXPLORER_COURSES_SCROLL_POSITION:
      s = {
        ...state,
        explorer: {
          ...otherExplorerKeys,
          courses: action.payload,
        },
      };
      return s;
    case TYPES.SET_EXPLORER_INTERESTS_SCROLL_POSITION:
      s = {
        ...state,
        explorer: {
          ...otherExplorerKeys,
          interests: action.payload,
        },
      };
      return s;
    case TYPES.SET_EXPLORER_OPPORTUNITIES_SCROLL_POSITION:
      s = {
        ...state,
        explorer: {
          ...otherExplorerKeys,
          opportunities: action.payload,
        },
      };
      return s;
    default:
      return state;
  }
};

export default reducer;
