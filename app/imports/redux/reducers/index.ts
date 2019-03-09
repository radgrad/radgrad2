// import { combineReducers } from 'redux';
import {
  SELECT_COURSE,
  SELECT_COURSE_INSTANCE,
  SELECT_OPPORTUNITY,
  SELECT_OPPORTUNITY_INSTANCE,
  CHECK_INTEGRITY_WORKING,
  CHECK_INTEGRITY_DONE,
  DUMP_DATABASE_WORKING,
  DUMP_DATABASE_DONE,
  GET_EMAILS_WORKING,
  GET_EMAILS_DONE,
  DepSelectedTabs,
} from '../actions/actionTypes';

const initialState = {
  depInspector: {
    selectedCourseID: '',
    selectedCourseInstanceID: '',
    selectedOpportunityID: '',
    selectedOpportunityInstanceID: '',
  },
  depTab: {
    selectedTab: DepSelectedTabs.SELECT_PLAN,
  },
  radgradWorking: {
    checkIntegrity: false,
    dumpDatabase: false,
    getStudentEmails: false,
  },
};

function radgradWorkingReducer(state = {}, action) {
  // console.log('radGradWorking state=%o, action=%o', state, action);
  switch (action.type) {
    case CHECK_INTEGRITY_WORKING:
      return {
        ...state,
        checkIntegrity: true,
      };
    case CHECK_INTEGRITY_DONE:
      return {
        ...state,
        checkIntegrity: false,
      };
    case DUMP_DATABASE_WORKING:
      return {
        ...state,
        dumpDatabase: true,
      };
    case DUMP_DATABASE_DONE:
      return {
        ...state,
        dumpDatabase: false,
      };
    case GET_EMAILS_WORKING:
      return {
        ...state,
        getStudentEmails: true,
      };
    case GET_EMAILS_DONE:
      return {
        ...state,
        getStudentEmails: false,
      };
    default:
      return state;
  }
}

function inspectorReducer(state = {}, action) {
  // console.log('inspectorReducer state=%o, action=%o', state, action);
  switch (action.type) {
    case SELECT_COURSE: // TODO: CAM not sure which way to go Object.assign or ...state.
      return Object.assign({}, state, {
        selectedCourseID: action.payload,
        selectedCourseInstanceID: '',
        selectedOpportunityID: '',
        selectedOpportunityInstanceID: '',
      });
    case SELECT_COURSE_INSTANCE:
      return Object.assign({}, state, {
        selectedCourseID: '',
        selectedCourseInstanceID: action.payload,
        selectedOpportunityID: '',
        selectedOpportunityInstanceID: '',
      });
    case SELECT_OPPORTUNITY:
      return {
        ...state,
        selectedCourseID: '',
        selectedCourseInstanceID: '',
        selectedOpportunityID: action.payload,
        selectedOpportunityInstanceID: '',
      };
    case SELECT_OPPORTUNITY_INSTANCE:
      return {
        ...state,
        selectedCourseID: '',
        selectedCourseInstanceID: '',
        selectedOpportunityID: '',
        selectedOpportunityInstanceID: action.payload,
      };
    default:
      return state;
  }
}

function tabReducer(state = {}, action) {
  // console.log('tabReducer state=%o action=%o', state, action);
  switch (action.type) {
    case DepSelectedTabs.SELECT_PLAN:
      return {
        selectedTab: DepSelectedTabs.SELECT_PLAN,
      };
    case DepSelectedTabs.SELECT_INSPECTOR:
      return {
        selectedTab: DepSelectedTabs.SELECT_INSPECTOR,
      };
    default:
      return state;
  }
}
const rootReducer = (state = initialState, action) => {
  // console.log('rootReducer state=%o action=%o', state, action);
  return {
    ...state,
    depInspector: inspectorReducer(state.depInspector, action),
    depTab: tabReducer(state.depTab, action),
    radgradWorking: radgradWorkingReducer(state.radgradWorking, action),
  };
};

// export default combineReducers({});
export default rootReducer;
