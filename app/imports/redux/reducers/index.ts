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
import { paginationReducer } from './paginationReducer';

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
    AcademicPlanCollection: {
      showIndex: 0,
      showCount: 25,
    },
    AcademicTermCollection: {
      showIndex: 0,
      showCount: 25,
    },
    AcademicYearInstanceCollection: {
      showIndex: 0,
      showCount: 25,
    },
    AdvisorLogCollection: {
      showIndex: 0,
      showCount: 25,
    },
    CareerGoalCollection: {
      showIndex: 0,
      showCount: 25,
    },
    CourseInstanceCollection: {
      showIndex: 0,
      showCount: 25,
    },
    CourseCollection: {
      showIndex: 0,
      showCount: 25,
    },
    DesiredDegreeCollection: {
      showIndex: 0,
      showCount: 25,
    },
    FeedCollection: {
      showIndex: 0,
      showCount: 25,
    },
    FeedbackInstanceCollection: {
      showIndex: 0,
      showCount: 25,
    },
    HelpMessageCollection: {
      showIndex: 0,
      showCount: 25,
    },
    InterestCollection: {
      showIndex: 0,
      showCount: 25,
    },
    InterestTypeCollection: {
      showIndex: 0,
      showCount: 25,
    },
    MentorAnswerCollection: {
      showIndex: 0,
      showCount: 25,
    },
    MentorQuestionCollection: {
      showIndex: 0,
      showCount: 25,
    },
    OpportunityCollection: {
      showIndex: 0,
      showCount: 25,
    },
    OpportuntiyInstanceCollection: {
      showIndex: 0,
      showCount: 25,
    },
    OpportunityTypeCollection: {
      showIndex: 0,
      showCount: 25,
    },
    PlanChoiceCollection: {
      showIndex: 0,
      showCount: 25,
    },
    ReviewCollection: {
      showIndex: 0,
      showCount: 25,
    },
    SlugCollection: {
      showIndex: 0,
      showCount: 25,
    },
    AdvisorProfileCollection: {
      showIndex: 0,
      showCount: 25,
    },
    FacultyProfileCollection: {
      showIndex: 0,
      showCount: 25,
    },
    MentorProfileCollection: {
      showIndex: 0,
      showCount: 25,
    },
    StudentProfileCollection: {
      showIndex: 0,
      showCount: 25,
    },
    TeaserCollection: {
      showIndex: 0,
      showCount: 25,
    },
    VerificationRequestCollection: {
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
