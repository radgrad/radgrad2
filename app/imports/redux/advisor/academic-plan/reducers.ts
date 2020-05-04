import * as TYPES from './types';

const initialState = {
  showOnlyUnderGraduateChoices: true,
};

function reducer(state: any = initialState, action) {
  switch (action.type) {
    case TYPES.SHOW_ONLY_UNDER_GRADUTE_CHOICES:
      return {
        ...state,
        showOnlyUnderGraduateChoices: action.payload,
      };
    default:
      return state;
  }

}

export default reducer;
