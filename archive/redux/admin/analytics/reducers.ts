import * as TYPES from './types';
import { UserInteraction } from '../../../../app/imports/typings/radgrad';

export interface AdminAnalyticsDateRange {
  startDate: Date;
  endDate: Date;
}

export type IAdminAnalyticsUserInteraction = { [username: string]: UserInteraction[] };

export type IAdminAnalyticsOverheadAnalysisBuckets = { [key: number]: number };

export interface AdminAnalyticsOverheadAnalysisData {
  username: string;
  'num-sessions': number;
  'num-docs': number;
  'docs-per-min': number;
  'total-time': number;
}

interface State {
  newsletter: {
    getStudentEmails: boolean;
    testNewsletter: boolean;
    levelNewsletter: boolean;
    allNewsletter: boolean;
  }
  overheadAnalysis: {
    dateRange: AdminAnalyticsDateRange;
    overheadBuckets: IAdminAnalyticsOverheadAnalysisBuckets;
    userInteractions: IAdminAnalyticsUserInteraction;
    overheadData: AdminAnalyticsOverheadAnalysisData[];
  }
  studentSummary: {
    dateRange: AdminAnalyticsDateRange;
    userInteractions: IAdminAnalyticsUserInteraction;
  };
}

const initialState: State = {
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
    overheadBuckets: {},
    userInteractions: {},
    overheadData: [],
  },
  studentSummary: {
    dateRange: {
      startDate: undefined,
      endDate: undefined,
    },
    userInteractions: {},
  },
};

const reducer = (state: State = initialState, action: { [props: string]: any }): State => {
  let s: State;
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
    case TYPES.SET_OVERHEAD_ANALYSIS_OVERHEAD_DATA:
      otherKeys = state.overheadAnalysis;
      s = {
        ...state,
        overheadAnalysis: {
          ...otherKeys,
          overheadData: action.payload,
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
};

export default reducer;
