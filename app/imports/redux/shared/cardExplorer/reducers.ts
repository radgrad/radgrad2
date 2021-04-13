
import * as TYPES from './types';

export interface CardExplorersPaginationState {
  showIndex: number;
}

interface State {
  courses: {
    filterValue: string;
  }
  pagination: {
    Opportunities: CardExplorersPaginationState;
  }
  opportunities: {
    sortValue: string;
  }
  interests: {
    sortValue: string;
  }
  careergoals: {
    sortValue: string;
  }
}

const initialState: State = {
  courses: {
    filterValue: 'All',
  },
  opportunities: {
    sortValue: 'Recommended',
  },
  interests: {
    sortValue: 'Most Recent',
  },
  careergoals: {
    sortValue: 'Most Recent',
  },
  pagination: {
    Opportunities: {
      showIndex: 0,
    },
  },
};

const reducer = (state: State = initialState, action): State => {
  let s: State;
  const paginationState = state.pagination;
  switch (action.type) {
    case TYPES.SET_OPPORTUNITIES_SHOW_INDEX:
      s = {
        ...state,
        pagination: {
          ...paginationState,
          Opportunities: {
            showIndex: action.payload,
          },
        },
      };
      return s;
    case TYPES.SET_COURSES_FILTER_VALUE:
      s = {
        ...state,
        courses: {
          filterValue: action.payload,
        },
      };
      return s;
    case TYPES.SET_OPPORTUNITIES_SORT_VALUE:
      s = {
        ...state,
        opportunities: {
          sortValue: action.payload,
        },
      };
      return s;
    case TYPES.SET_INTERESTS_SORT_VALUE:
      s = {
        ...state,
        interests: {
          sortValue: action.payload,
        },
      };
      return s;
    case TYPES.SET_CAREERGOALS_SORT_VALUE:
      s = {
        ...state,
        careergoals: {
          sortValue: action.payload,
        },
      };
      return s;
    default:
      return state;
  }
};

export default reducer;
