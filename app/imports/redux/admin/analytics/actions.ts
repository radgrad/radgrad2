import { Dictionary } from 'lodash';
import * as TYPES from './types';

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

interface ISetOverheadBucketsAction extends IAction {
  payload: number[];
}

interface ISetUserInteractionsAction extends IAction {
  payload: Dictionary<any[]>;
}

interface INewsletterAction extends IAction {
  payload: boolean;
}

// Admin Analytics Overhead Analysis
export const setOverheadAnalysisDateRange = (dateRange: ISetDateRangeProps): ISetDateRangeAction => ({
  type: TYPES.SET_OVERHEAD_ANALYSIS_DATE_RANGE,
  payload: dateRange,
});

export const setOverheadBuckets = (overheadBuckets: any[]): ISetOverheadBucketsAction => ({
  type: TYPES.SET_OVERHEAD_ANALYSIS_OVERHEAD_BUCKETS,
  payload: overheadBuckets,
});

export const setUserInteractions = (userInteractions: Dictionary<any[]>): ISetUserInteractionsAction => ({
  type: TYPES.SET_OVERHEAD_ANALYSIS_USER_INTERACTIONS,
  payload: userInteractions,
});

export const setOverheadData = (overheadData) => ({
  type: TYPES.SET_OVERHEAD_ANALYSIS_OVERHEAD_DATA,
  payload: overheadData,
});

// Admin Analytics Student Summary
export const setStudentSummaryDateRange = (dateRange: ISetDateRangeProps): ISetDateRangeAction => ({
  type: TYPES.SET_STUDENT_SUMMARY_DATE_RANGE,
  payload: dateRange,
});

export const setStudentSummaryUserInteractions = (userInteractions: Dictionary<any[]>): ISetUserInteractionsAction => ({
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
