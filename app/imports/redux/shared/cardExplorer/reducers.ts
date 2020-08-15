import * as TYPES from './types';

export interface ICardExplorersPaginationState {
  showIndex: number;
}

interface IState {
  pagination: {
    Opportunities: ICardExplorersPaginationState;
  }
}

const initialState: IState = {
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
    default:
      return state;
  }
}

export default reducer;
