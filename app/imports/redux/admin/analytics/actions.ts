import * as TYPES from './types';

export const startGetStudentEmails = () => ({
  type: TYPES.GET_EMAILS_WORKING,
  payload: true,
});

export const getStudentEmailsDone = () => ({
  type: TYPES.GET_EMAILS_DONE,
  payload: false,
});

export const startTestNewsletter = () => ({
  type: TYPES.TEST_EMAIL_WORKING,
  payload: true,
});

export const testNewsletterDone = () => ({
  type: TYPES.TEST_EMAIL_DONE,
  payload: false,
});

export const startLevelNewsletter = () => ({
  type: TYPES.LEVEL_EMAIL_WORKING,
  payload: true,
});

export const levelNewsletterDone = () => ({
  type: TYPES.LEVEL_EMAIL_DONE,
  payload: false,
});

export const startAllNewsletter = () => ({
  type: TYPES.ALL_EMAIL_WORKING,
  payload: true,
});

export const allNewsletterDone = () => ({
  type: TYPES.ALL_EMAIL_DONE,
  payload: false,
});
