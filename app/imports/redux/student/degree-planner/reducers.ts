import { combineReducers } from 'redux';
import * as TYPES from './types';

const initialState = {
  depInspector: {
    selectedCourseID: '',
    selectedCourseInstanceID: '',
    selectedOpportunityID: '',
    selectedOpportunityInstanceID: '',
  },
  depTab: {
    selectedTab: TYPES.SELECT_PLAN,
  },
};

function inspectorReducer(state: any = initialState, action) {
  // console.log('inspectorReducer', action, state);
  const depInspector = state.depInspector;
  switch (action.type) {
    case TYPES.SELECT_COURSE:
      return {
        ...state,
        selectedCourseID: action.payload,
        selectedCourseInstanceID: '',
        selectedOpportunityID: '',
        selectedOpportunityInstanceID: '',
      };
    case TYPES.SELECT_COURSE_INSTANCE:
      return {
        ...state,
        selectedCourseID: '',
        selectedCourseInstanceID: action.payload,
        selectedOpportunityID: '',
        selectedOpportunityInstanceID: '',
      };
    case TYPES.SELECT_OPPORTUNITY:
      return {
        ...state,
        selectedCourseID: '',
        selectedCourseInstanceID: '',
        selectedOpportunityID: action.payload,
        selectedOpportunityInstanceID: '',
      };
    case TYPES.SELECT_OPPORTUNITY_INSTANCE:
      return {
        ...state,
        depInspector: {
          ...depInspector,
          selectedCourseID: '',
          selectedCourseInstanceID: '',
          selectedOpportunityID: '',
          selectedOpportunityInstanceID: action.payload,
        },
      };
    default:
      return state;
  }
}

function tabReducer(state: any = initialState, action) {
  switch (action.type) {
    case TYPES.SELECT_PLAN:
      return {
        selectedTab: TYPES.SELECT_PLAN,
      };
    case TYPES.SELECT_INSPECTOR:
      return {
        selectedTab: TYPES.SELECT_INSPECTOR,
      };
    case TYPES.SELECT_FAVORITE_OPPORTUNITIES:
      return {
        selectedTab: TYPES.SELECT_FAVORITE_OPPORTUNITIES,
      };
    case TYPES.SELECT_FAVORITE_PLANS:
      return {
        selectedTab: TYPES.SELECT_FAVORITE_PLANS,
      };
    case TYPES.SELECT_FAVORITE_COURSES:
      return {
        selectedTab: TYPES.SELECT_FAVORITE_COURSES,
      };
    case TYPES.SELECT_FAVORITE_DETAILS:
      return {
        selectedTab: TYPES.SELECT_FAVORITE_DETAILS,
      };

    default:
      return state;
  }
}

const reducer = combineReducers({
  inspector: inspectorReducer,
  tab: tabReducer,
});

export default reducer;
