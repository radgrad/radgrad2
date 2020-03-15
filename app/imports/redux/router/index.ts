// import { LOCATION_CHANGE } from 'connected-react-router';
import * as TYPES from './types';
import * as routerTrackerActions from './actions';

const initialState = {
  lastPathname: '',
};

function reducer(state: any = initialState, action) {
  switch (action.type) {
    case TYPES.SET_LAST_PATHNAME:
      return {
        ...state,
        lastPathname: action.payload,
      };
    default:
      return state;
  }
}


// function reducer(state: any = initialState, action) {
//   switch (action.type) {
//     case LOCATION_CHANGE:
//       return {
//         ...state,
//         lastPathname: action.payload,
//       };
//     default:
//       return state;
//   }
// }

export { routerTrackerActions };
export default reducer;
