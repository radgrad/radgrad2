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

const inspectorReducer = (state: any = initialState, action) => {
  // console.log('inspectorReducer', action, state);
  const depInspector = state.depInspector;
  switch (action.type) {
    case TYPES.SELECT_COURSE:
      return {
        ...state,
        depInspector: {
          ...depInspector,
          selectedCourseID: action.payload,
          selectedCourseInstanceID: '',
          selectedOpportunityID: '',
          selectedOpportunityInstanceID: '',
        },
      };
    case TYPES.SELECT_COURSE_INSTANCE:
      // console.log('select ci ', action);
      return {
        ...state,
        depInspector: {
          ...depInspector,
          selectedCourseID: '',
          selectedCourseInstanceID: action.payload,
          selectedOpportunityID: '',
          selectedOpportunityInstanceID: '',
        },
      };
    case TYPES.SELECT_OPPORTUNITY:
      return {
        ...state,
        depInspector: {
          ...depInspector,
          selectedCourseID: '',
          selectedCourseInstanceID: '',
          selectedOpportunityID: action.payload,
          selectedOpportunityInstanceID: '',
        },
      };
    case TYPES.SELECT_OPPORTUNITY_INSTANCE:
      // console.log('select oi ', action);
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
};

const tabReducer = (state: any = initialState, action) => {
  switch (action.type) {
    case TYPES.SELECT_PLAN:
      return {
        selectedTab: TYPES.SELECT_PLAN,
      };
    case TYPES.SELECT_INSPECTOR:
      return {
        selectedTab: TYPES.SELECT_INSPECTOR,
      };
    case TYPES.SELECT_PROFILE_OPPORTUNITIES:
      return {
        selectedTab: TYPES.SELECT_PROFILE_OPPORTUNITIES,
      };
    case TYPES.SELECT_PROFILE_COURSES:
      return {
        selectedTab: TYPES.SELECT_PROFILE_COURSES,
      };
    case TYPES.SELECT_PROFILE_DETAILS:
      return {
        selectedTab: TYPES.SELECT_PROFILE_DETAILS,
      };

    default:
      return state;
  }
};

const reducer = combineReducers({
  inspector: inspectorReducer,
  tab: tabReducer,
});

export default reducer;
