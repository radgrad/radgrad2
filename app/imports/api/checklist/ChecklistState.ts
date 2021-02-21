import _ from 'lodash';

export const CHECKLIST_STATE = {
  OK: 'OK',
  REVIEW: 'Review',
  IMPROVE: 'Improve',
};

export const CHECKLIST_STATES = _.values(CHECKLIST_STATE);

export type ChecklistState = 'OK' | 'Review' | 'Improve';
