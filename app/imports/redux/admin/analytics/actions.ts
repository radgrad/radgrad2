import * as TYPES from './types';

interface IAction {
  type: string;
}

interface ISetDatePickerAction extends IAction {
  payload: Date;
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
