// import { combineReducers } from 'redux';
import {
  ALL_EMAIL_DONE,
  ALL_EMAIL_WORKING,
  CHECK_INTEGRITY_DONE,
  CHECK_INTEGRITY_WORKING,
  DepSelectedTabs,
  DUMP_DATABASE_DONE,
  DUMP_DATABASE_WORKING,
  GET_EMAILS_DONE,
  GET_EMAILS_WORKING,
  LEVEL_EMAIL_DONE,
  LEVEL_EMAIL_WORKING,
  SELECT_COURSE,
  SELECT_COURSE_INSTANCE,
  SELECT_OPPORTUNITY,
  SELECT_OPPORTUNITY_INSTANCE,
  TEST_EMAIL_DONE,
  TEST_EMAIL_WORKING,
} from '../actions/actionTypes';
import {
  ADVISOR_HOME_SET_FIRST_NAME,
  ADVISOR_HOME_SET_LAST_NAME,
  ADVISOR_HOME_SET_USERNAME,
  ADVISOR_HOME_CLEAR_FILTER,
  ADVISOR_HOME_SET_SELECTED_STUDENT_USERNAME,
  ADVISOR_HOME_SET_IS_LOADED,
} from '../actions/pageAdvisorActionTypes';
import { paginationReducer } from './paginationReducer';
import { studentHomePageReducer } from './studentHomePageReducer';
import { cardExplorerPageReducer } from './cardExplorerPageReducer';

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
    OpportunityInstanceCollection: {
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
  studentHomePage: {
    studentOfInterestWidget: {
      hiddenCourses: true,
      hiddenOpportunities: true,
    },
  },
  cardExplorerPage: {
    cardExplorerWidget: {
      hiddenCourses: true,
      hiddenOpportunities: true,
    },
  },
  adminAnalyticsOverheadAnalysisPage: {
    adminAnalyticsDateSelectionWidget: {
      startDate: '',
      endDate: ''
    }
  },
  page: {
    advisor: {
      home: {
        firstName: '',
        lastName: '',
        username: '',
        selectedUsername: '',
        isLoaded: false,
      },
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

function pageReducer(state: any = {}, action) {
  switch (action.type) {
    case ADVISOR_HOME_SET_FIRST_NAME:
      return {
        ...state,
        advisor: {
          ...state.advisor,
          home: {
            ...state.advisor.home,
            firstName: action.payload,
          },
        },
      };
    case ADVISOR_HOME_SET_LAST_NAME:
      return {
        ...state,
        advisor: {
          ...state.advisor,
          home: {
            ...state.advisor.home,
            lastName: action.payload,
          },
        },
      };
    case ADVISOR_HOME_SET_USERNAME:
      return {
        ...state,
        advisor: {
          ...state.advisor,
          home: {
            ...state.advisor.home,
            username: action.payload,
          },
        },
      };
    case ADVISOR_HOME_CLEAR_FILTER:
      return {
        ...state,
        advisor: {
          ...state.advisor,
          home: {
            ...state.advisor.home,
            firstName: '',
            lastName: '',
            username: '',
          },
        },
      };
    case ADVISOR_HOME_SET_SELECTED_STUDENT_USERNAME:
      return {
        ...state,
        advisor: {
          ...state.advisor,
          home: {
            ...state.advisor.home,
            selectedUsername: action.payload,
            isLoaded: false,
          },
        },
      };
    case ADVISOR_HOME_SET_IS_LOADED:
      return {
        ...state,
        advisor: {
          ...state.advisor,
          home: {
            ...state.advisor.home,
            isLoaded: action.payload,
          },
        },
      };

    default:
      return state;
  }
}

// console.log('rootReducer state=%o action=%o', state, action);
const rootReducer = (state = initialState, action) => ({
  ...state,
  depInspector: inspectorReducer(state.depInspector, action),
  depTab: tabReducer(state.depTab, action),
  radgradWorking: radgradWorkingReducer(state.radgradWorking, action),
  pagination: paginationReducer(state.pagination, action),
  studentHomePage: studentHomePageReducer(state.studentHomePage, action),
  cardExplorerPage: cardExplorerPageReducer(state.cardExplorerPage, action),
  page: pageReducer(state.page, action),
});

// export default combineReducers({});
export default rootReducer;
