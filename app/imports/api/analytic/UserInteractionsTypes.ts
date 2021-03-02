// UserInteraction Types
export enum UserInteractionsTypes {
  /* General Tracking */
  PAGEVIEW = 'pageView',
  LOGIN = 'login',
  LOGOUT = 'logout',
  LEVEL = 'level',
  COMPLETEPLAN = 'completePlan',
  /* Student About Me Page */
  PICTURE = 'picture',
  WEBSITE = 'website',
  SHAREINFORMATION = 'shareInformation',
  /* Degree Planner */
  // Dragging a course/opportunity to the planner
  ADDCOURSE = 'addCourse',
  ADDOPPORTUNITY = 'addOpportunity',
  // Moving a course/opportunity from a term to another term
  UPDATECOURSE = 'updateCourse',
  UPDATEOPPORTUNITY = 'updateOpportunity',
  // Removing a course/opportunity from the planner
  REMOVECOURSE = 'removeCourse',
  REMOVEOPPORTUNITY = 'removeOpportunity',
  // CAM: Not going to change this since we have a bunch of user interactions with this term type in them.
  // TODO is this the correct answer?
  FAVORITEITEM = 'favoriteItem',
  UNFAVORITEITEM = 'unFavoriteItem',
  /* Reviews */
  ADDREVIEW = 'addReview',
  EDITREVIEW = 'editReview',
  /* Degree Planner */
  VERIFYREQUEST = 'verifyRequest',
}

// Default string if we do not need to store a typeData for that User Interaction
export const USERINTERACTIONSNOTYPEDATA = 'N/A';
