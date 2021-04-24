
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
    filterValue: string;
  }
  interests: {
    sortValue: string;
    filterValue: string;
  }
  careergoals: {
    sortValue: string;
    filterValue: string;
  }
}

const initialState: State = {
  courses: {
    filterValue: 'All',
  },
  opportunities: {
    sortValue: 'Recommended',
    filterValue: 'All',
  },
  interests: {
    sortValue: 'Most Recent',
    filterValue: 'All',
  },
  careergoals: {
    sortValue: 'Most Recent',
    filterValue: 'All',
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
    case TYPES.SET_OPPORTUNITIES_FILTER_VALUE:
      s = {
        ...state,
        opportunities: {
          sortValue: action.payload,
          filterValue: action.payload,
        },
      };
      return s;
    case TYPES.SET_INTERESTS_SORT_VALUE:
    case TYPES.SET_INTERESTS_FILTER_VALUE:
      s = {
        ...state,
        interests: {
          sortValue: action.payload,
          filterValue: action.payload,
        },
      };
      return s;
    case TYPES.SET_CAREERGOALS_SORT_VALUE:
    case TYPES.SET_CAREERGOALS_FILTER_VALUE:
      s = {
        ...state,
        careergoals: {
          sortValue: action.payload,
          filterValue: action.payload,
        },
      };
      return s;
    default:
      return state;
  }
};

export default reducer;
