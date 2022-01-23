// Technical debt add internships.

// types for profile entries
export enum PROFILE_ENTRY_TYPE {
  CAREERGOAL = 'careerGoal',
  COURSE = 'course',
  INTEREST = 'interest',
  OPPORTUNITY = 'opportunity',
}

export type IProfileEntryTypes =
  PROFILE_ENTRY_TYPE.CAREERGOAL
  | PROFILE_ENTRY_TYPE.COURSE
  | PROFILE_ENTRY_TYPE.INTEREST
  | PROFILE_ENTRY_TYPE.OPPORTUNITY;

export const enum PROFILE_ENTITY_COLLECTIONS {
  CAREER_GOALS = 'ProfileCareerGoalCollection',
  COURSES = 'ProfileCourseCollection',
  INTERESTS = 'ProfileInterestCollection',
  OPPORTUNITIES = 'ProfileOpportunityCollection',
}
