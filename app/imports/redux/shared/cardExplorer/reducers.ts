import * as TYPES from './types';

export interface ICardExplorersPaginationState {
  showIndex: number;
}

interface IState {
  courses: {
    filterValue: string;
  }
  pagination: {
    Opportunities: ICardExplorersPaginationState;
  }
  opportunities: {
    sortValue: string;
  }
}

const initialState: IState = {
  courses: {
    filterValue: 'All',
  },
  opportunities: {
    sortValue: 'Recommended',
  },
  pagination: {
    Opportunities: {
      showIndex: 0,
    },
  },
};

function reducer(state: IState = initialState, action): IState {
  let s: IState;
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
    default:
      return state;
  }
}

export default reducer;
