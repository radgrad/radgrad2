// types for profile entries
export enum PROFILE_ENTRY_TYPE {
  CAREERGOAL = 'careerGoal',
  COURSE = 'course',
  INTEREST = 'interest',
  OPPORTUNITY = 'opportunity',
}

export type IFavoriteTypes =
  PROFILE_ENTRY_TYPE.CAREERGOAL
  | PROFILE_ENTRY_TYPE.COURSE
  | PROFILE_ENTRY_TYPE.INTEREST
  | PROFILE_ENTRY_TYPE.OPPORTUNITY;
