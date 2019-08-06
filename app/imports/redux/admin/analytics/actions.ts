// eslint-disable-next-line no-unused-vars
import { Dictionary } from 'lodash';
import * as TYPES from './types';


interface IAction {
  type: string;
}

interface ISetDatePickerAction extends IAction {
  payload: Date;
}

interface ISetOverheadBucketsAction extends IAction {
  payload: any[];
}

interface ISetUserInteractionsAction extends IAction {
  payload: Dictionary<any[]>;
}

interface INewsletterAction extends IAction {
  payload: boolean;
}

export const setOverheadAnalysisStartDate = (startDate: Date): ISetDatePickerAction => ({
  type: TYPES.SET_OVERHEAD_ANALYSIS_START_DATE,
  payload: startDate,
});

export const setOverheadAnalysisEndDate = (endDate: Date): ISetDatePickerAction => ({
  type: TYPES.SET_OVERHEAD_ANALYSIS_END_DATE,
  payload: endDate,
});

export const setOverheadBuckets = (overheadBuckets: any[]): ISetOverheadBucketsAction => ({
  type: TYPES.SET_OVERHEAD_ANALYSIS_OVERHEAD_BUCKETS,
  payload: overheadBuckets,
});

export const setUserInteractions = (userInteractions: Dictionary<any[]>): ISetUserInteractionsAction => ({
  type: TYPES.SET_OVERHEAD_ANALYSIS_USER_INTERACTIONS,
  payload: userInteractions,
});

export const setStudentSummaryStartDate = (startDate: Date): ISetDatePickerAction => ({
  type: TYPES.SET_STUDENT_SUMMARY_START_DATE,
  payload: startDate,
});

export const setStudentSummaryEndDate = (endDate: Date): ISetDatePickerAction => ({
  type: TYPES.SET_STUDENT_SUMMARY_END_DATE,
  payload: endDate,
});

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
