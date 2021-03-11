import _ from 'lodash';

export const CHECKLIST_STATE = {
  AWESOME: 'Awesome',
  REVIEW: 'Review',
  IMPROVE: 'Improve',
};

export const CHECKLIST_STATES = _.values(CHECKLIST_STATE);

export type ChecklistState = 'Awesome' | 'Review' | 'Improve';
