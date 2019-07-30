import * as TYPES from './types';

interface IAction {
  type: string;
}

interface ISetDatePickerAction extends IAction {
  payload: any;
}

interface INewsletterAction extends IAction {
  payload: boolean;

}

export const setDatePickerStartDate = (type: string, startDate: any): ISetDatePickerAction => ({
  type: type,
  payload: startDate,
});

export const setDatePickerEndDate = (type: string, endDate: any): ISetDatePickerAction => ({
  type: type,
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
