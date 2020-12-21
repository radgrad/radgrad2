import * as TYPES from './types';
import {
  IAdminAnalyticsOverheadAnalysisBuckets,
  AdminAnalyticsOverheadAnalysisData,
  IAdminAnalyticsUserInteraction,
} from './reducers';

interface Action {
  type: string;
}

export interface SetDateRangeProps {
  startDate: Date;
  endDate: Date;
}

interface SetDateRangeAction extends Action {
  payload: {
    startDate: Date;
    endDate: Date;
  };
}

interface SetOverheadAnalysisBucketsAction extends Action {
  payload: IAdminAnalyticsOverheadAnalysisBuckets;
}

interface SetOverheadAnalysisDataAction extends Action {
  payload: AdminAnalyticsOverheadAnalysisData[];
}

interface SetUserInteractionsAction extends Action {
  payload: IAdminAnalyticsUserInteraction;
}

interface NewsletterAction extends Action {
  payload: boolean;
}

// Admin Analytics Overhead Analysis
export const setOverheadAnalysisDateRange = (dateRange: SetDateRangeProps): SetDateRangeAction => ({
  type: TYPES.SET_OVERHEAD_ANALYSIS_DATE_RANGE,
  payload: dateRange,
});

export const setOverheadAnalysisBuckets = (overheadBuckets: IAdminAnalyticsOverheadAnalysisBuckets): SetOverheadAnalysisBucketsAction => ({
  type: TYPES.SET_OVERHEAD_ANALYSIS_OVERHEAD_BUCKETS,
  payload: overheadBuckets,
});

export const setOverheadAnalysisUserInteractions = (userInteractions: IAdminAnalyticsUserInteraction): SetUserInteractionsAction => ({
  type: TYPES.SET_OVERHEAD_ANALYSIS_USER_INTERACTIONS,
  payload: userInteractions,
});

export const setOverheadAnalysisData = (overheadData: AdminAnalyticsOverheadAnalysisData[]): SetOverheadAnalysisDataAction => ({
  type: TYPES.SET_OVERHEAD_ANALYSIS_OVERHEAD_DATA,
  payload: overheadData,
});

// Admin Analytics Student Summary
export const setStudentSummaryDateRange = (dateRange: SetDateRangeProps): SetDateRangeAction => ({
  type: TYPES.SET_STUDENT_SUMMARY_DATE_RANGE,
  payload: dateRange,
});

export const setStudentSummaryUserInteractions = (userInteractions: IAdminAnalyticsUserInteraction): SetUserInteractionsAction => ({
  type: TYPES.SET_STUDENT_SUMMARY_USER_INTERACTIONS,
  payload: userInteractions,
});

// Admin Analytics Newsletter
export const startGetStudentEmails = (): NewsletterAction => ({
  type: TYPES.GET_EMAILS_WORKING,
  payload: true,
});

export const getStudentEmailsDone = (): NewsletterAction => ({
  type: TYPES.GET_EMAILS_DONE,
  payload: false,
});

export const startTestNewsletter = (): NewsletterAction => ({
  type: TYPES.TEST_EMAIL_WORKING,
  payload: true,
});

export const testNewsletterDone = (): NewsletterAction => ({
  type: TYPES.TEST_EMAIL_DONE,
  payload: false,
});

export const startLevelNewsletter = (): NewsletterAction => ({
  type: TYPES.LEVEL_EMAIL_WORKING,
  payload: true,
});

export const levelNewsletterDone = (): NewsletterAction => ({
  type: TYPES.LEVEL_EMAIL_DONE,
  payload: false,
});

export const startAllNewsletter = (): NewsletterAction => ({
  type: TYPES.ALL_EMAIL_WORKING,
  payload: true,
});

export const allNewsletterDone = (): NewsletterAction => ({
  type: TYPES.ALL_EMAIL_DONE,
  payload: false,
});
