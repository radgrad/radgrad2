import * as TYPES from './types';

export const setShowOnlyUnderGraduateChoices = (bool) => ({
  type: TYPES.SHOW_ONLY_UNDER_GRADUTE_CHOICES,
  payload: bool,
});
