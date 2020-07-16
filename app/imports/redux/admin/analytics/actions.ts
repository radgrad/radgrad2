import * as TYPES from './types';
import {
  IAdminAnalyticsOverheadAnalysisBuckets,
  IAdminAnalyticsOverheadAnalysisData,
  IAdminAnalyticsUserInteraction,
} from './reducers';

interface IAction {
  type: string;
}

export interface ISetDateRangeProps {
  startDate: Date;
  endDate: Date;
}

interface ISetDateRangeAction extends IAction {
  payload: {
    startDate: Date;
    endDate: Date;
  };
}

interface ISetOverheadAnalysisBucketsAction extends IAction {
  payload: IAdminAnalyticsOverheadAnalysisBuckets;
}

interface ISetOverheadAnalysisDataAction extends IAction {
  payload: IAdminAnalyticsOverheadAnalysisData[];
}

interface ISetUserInteractionsAction extends IAction {
  payload: IAdminAnalyticsUserInteraction;
}

interface INewsletterAction extends IAction {
  payload: boolean;
}

// Admin Analytics Overhead Analysis
export const setOverheadAnalysisDateRange = (dateRange: ISetDateRangeProps): ISetDateRangeAction => ({
  type: TYPES.SET_OVERHEAD_ANALYSIS_DATE_RANGE,
  payload: dateRange,
});

export const setOverheadAnalysisBuckets = (overheadBuckets: IAdminAnalyticsOverheadAnalysisBuckets): ISetOverheadAnalysisBucketsAction => ({
  type: TYPES.SET_OVERHEAD_ANALYSIS_OVERHEAD_BUCKETS,
  payload: overheadBuckets,
});

export const setOverheadAnalysisUserInteractions = (userInteractions: IAdminAnalyticsUserInteraction): ISetUserInteractionsAction => ({
  type: TYPES.SET_OVERHEAD_ANALYSIS_USER_INTERACTIONS,
  payload: userInteractions,
});

export const setOverheadAnalysisData = (overheadData: IAdminAnalyticsOverheadAnalysisData[]): ISetOverheadAnalysisDataAction => ({
  type: TYPES.SET_OVERHEAD_ANALYSIS_OVERHEAD_DATA,
  payload: overheadData,
});

// Admin Analytics Student Summary
export const setStudentSummaryDateRange = (dateRange: ISetDateRangeProps): ISetDateRangeAction => ({
  type: TYPES.SET_STUDENT_SUMMARY_DATE_RANGE,
  payload: dateRange,
});

export const setStudentSummaryUserInteractions = (userInteractions: IAdminAnalyticsUserInteraction): ISetUserInteractionsAction => ({
  type: TYPES.SET_STUDENT_SUMMARY_USER_INTERACTIONS,
  payload: userInteractions,
});

// Admin Analytics Newsletter
export const startGetStudentEmails = (): INewsletterAction => ({
  type: TYPES.GET_EMAILS_WORKING,
  payload: true,
});

export const getStudentEmailsDone = (): INewsletterAction => ({
  type: TYPES.GET_EMAILS_DONE,
  payload: false,
});

export const startTestNewsletter = (): INewsletterAction => ({
  type: TYPES.TEST_EMAIL_WORKING,
  payload: true,
});

export const testNewsletterDone = (): INewsletterAction => ({
  type: TYPES.TEST_EMAIL_DONE,
  payload: false,
});

export const startLevelNewsletter = (): INewsletterAction => ({
  type: TYPES.LEVEL_EMAIL_WORKING,
  payload: true,
});

export const levelNewsletterDone = (): INewsletterAction => ({
  type: TYPES.LEVEL_EMAIL_DONE,
  payload: false,
});

export const startAllNewsletter = (): INewsletterAction => ({
  type: TYPES.ALL_EMAIL_WORKING,
  payload: true,
});

export const allNewsletterDone = (): INewsletterAction => ({
  type: TYPES.ALL_EMAIL_DONE,
  payload: false,
});
