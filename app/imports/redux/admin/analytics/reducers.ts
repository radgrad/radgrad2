import * as TYPES from './types';
import { IUserInteraction } from '../../../typings/radgrad';

export interface IAdminAnalyticsDateRange {
  startDate: Date;
  endDate: Date;
}

export type IAdminAnalyticsUserInteraction = { [username: string]: IUserInteraction[] };

interface IState {
  newsletter: {
    getStudentEmails: boolean;
    testNewsletter: boolean;
    levelNewsletter: boolean;
    allNewsletter: boolean;
  }
  overheadAnalysis: {
    dateRange: IAdminAnalyticsDateRange;
    overheadBuckets: any[];
    userInteractions: IAdminAnalyticsUserInteraction;
  }
  studentSummary: {
    dateRange: IAdminAnalyticsDateRange;
    userInteractions: IAdminAnalyticsUserInteraction;
  };
}

const initialState: IState = {
  newsletter: {
    getStudentEmails: false,
    testNewsletter: false,
    levelNewsletter: false,
    allNewsletter: false,
  },
  overheadAnalysis: {
    dateRange: {
      startDate: undefined,
      endDate: undefined,
    },
    overheadBuckets: [],
    userInteractions: {},
  },
  studentSummary: {
    dateRange: {
      startDate: undefined,
      endDate: undefined,
    },
    userInteractions: {},
  },
};

function reducer(state: IState = initialState, action: { [props: string]: any }): IState {
  let s: IState;
  let otherKeys;
  switch (action.type) {
    case TYPES.GET_EMAILS_WORKING:
      otherKeys = state.newsletter;
      s = {
        ...state,
        newsletter: {
          ...otherKeys,
          getStudentEmails: true,
        },
      };
      return s;
    case TYPES.GET_EMAILS_DONE:
      otherKeys = state.newsletter;
      s = {
        ...state,
        newsletter: {
          ...otherKeys,
          getStudentEmails: false,
        },
      };
      return s;
    case TYPES.TEST_EMAIL_WORKING:
      otherKeys = state.newsletter;
      s = {
        ...state,
        newsletter: {
          ...otherKeys,
          testNewsletter: true,
        },
      };
      return s;
    case TYPES.TEST_EMAIL_DONE:
      otherKeys = state.newsletter;
      s = {
        ...state,
        newsletter: {
          ...otherKeys,
          testNewsletter: false,
        },
      };
      return s;
    case TYPES.LEVEL_EMAIL_WORKING:
      otherKeys = state.newsletter;
      s = {
        ...state,
        newsletter: {
          ...otherKeys,
          levelNewsletter: true,
        },
      };
      return s;
    case TYPES.LEVEL_EMAIL_DONE:
      otherKeys = state.newsletter;
      s = {
        ...state,
        newsletter: {
          ...otherKeys,
          levelNewsletter: false,
        },
      };
      return s;
    case TYPES.ALL_EMAIL_WORKING:
      otherKeys = state.newsletter;
      s = {
        ...state,
        newsletter: {
          ...otherKeys,
          allNewsletter: true,
        },
      };
      return s;
    case TYPES.ALL_EMAIL_DONE:
      otherKeys = state.newsletter;
      s = {
        ...state,
        newsletter: {
          ...otherKeys,
          allNewsletter: false,
        },
      };
      return s;
    case TYPES.SET_OVERHEAD_ANALYSIS_DATE_RANGE:
      otherKeys = state.overheadAnalysis;
      s = {
        ...state,
        overheadAnalysis: {
          ...otherKeys,
          dateRange: action.payload,
        },
      };
      return s;
    case TYPES.SET_OVERHEAD_ANALYSIS_OVERHEAD_BUCKETS:
      otherKeys = state.overheadAnalysis;
      s = {
        ...state,
        overheadAnalysis: {
          ...otherKeys,
          overheadBuckets: action.payload,
        },
      };
      return s;
    case TYPES.SET_OVERHEAD_ANALYSIS_USER_INTERACTIONS:
      otherKeys = state.overheadAnalysis;
      s = {
        ...state,
        overheadAnalysis: {
          ...otherKeys,
          userInteractions: action.payload,
        },
      };
      return s;
    case TYPES.SET_STUDENT_SUMMARY_DATE_RANGE:
      otherKeys = state.studentSummary;
      s = {
        ...state,
        studentSummary: {
          ...otherKeys,
          dateRange: action.payload,
        },
      };
      return s;
    case TYPES.SET_STUDENT_SUMMARY_USER_INTERACTIONS:
      otherKeys = state.studentSummary;
      s = {
        ...state,
        studentSummary: {
          ...otherKeys,
          userInteractions: action.payload,
        },
      };
      return s;
    default:
      return state;
  }
}

export default reducer;
