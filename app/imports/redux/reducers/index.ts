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
  TEST_EMAIL_WORKING,
  TEST_EMAIL_DONE,
  LEVEL_EMAIL_WORKING,
  LEVEL_EMAIL_DONE,
  ALL_EMAIL_WORKING,
  ALL_EMAIL_DONE,
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
    testNewsletter: false,
    levelNewsletter: false,
    allNewsletter: false,
  },
  pagination: {
    academicPlans: {
      showIndex: 0,
      showCount: 25,
    },
    academicTerms: {
      showIndex: 0,
      showCount: 25,
    },
    academicYears: {
      showIndex: 0,
      showCount: 25,
    },
    advisorLogs: {
      showIndex: 0,
      showCount: 25,
    },
    careerGoals: {
      showIndex: 0,
      showCount: 25,
    },
    courseInstances: {
      showIndex: 0,
      showCount: 25,
    },
    courses: {
      showIndex: 0,
      showCount: 25,
    },
    desiredDegrees: {
      showIndex: 0,
      showCount: 25,
    },
    feeds: {
      showIndex: 0,
      showCount: 25,
    },
    feedbackInstances: {
      showIndex: 0,
      showCount: 25,
    },
    helpMessages: {
      showIndex: 0,
      showCount: 25,
    },
    interests: {
      showIndex: 0,
      showCount: 25,
    },
    interestTypes: {
      showIndex: 0,
      showCount: 25,
    },
    mentorAnswers: {
      showIndex: 0,
      showCount: 25,
    },
    mentorQuestions: {
      showIndex: 0,
      showCount: 25,
    },
    opportunities: {
      showIndex: 0,
      showCount: 25,
    },
    opportunityInstances: {
      showIndex: 0,
      showCount: 25,
    },
    opportunityTypes: {
      showIndex: 0,
      showCount: 25,
    },
    planChoices: {
      showIndex: 0,
      showCount: 25,
    },
    reviews: {
      showIndex: 0,
      showCount: 25,
    },
    slugs: {
      showIndex: 0,
      showCount: 25,
    },
    teasers: {
      showIndex: 0,
      showCount: 25,
    },
    verificationRequests: {
      showIndex: 0,
      showCount: 25,
    },
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
    case TEST_EMAIL_WORKING:
      return {
        ...state,
        testNewsletter: true,
      };
    case TEST_EMAIL_DONE:
      return {
        ...state,
        testNewsletter: false,
      };
    case LEVEL_EMAIL_WORKING:
      return {
        ...state,
        levelNewsletter: true,
      };
    case LEVEL_EMAIL_DONE:
      return {
        ...state,
        levelNewsletter: false,
      };
    case ALL_EMAIL_WORKING:
      return {
        ...state,
        allNewsletter: true,
      };
    case ALL_EMAIL_DONE:
      return {
        ...state,
        allNewsletter: false,
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

function paginationReducer(state = {}, action) {
  // console.log('pagination state=%o, action=%o', state, action);
  switch (action.type) {
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
    pagination: paginationReducer(state.pagination, action),
  };
};

// export default combineReducers({});
export default rootReducer;
