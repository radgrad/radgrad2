// UserInteraction Types
export enum UserInteractionsTypes {
  /* General Tracking */
  PAGE_VIEW = 'pageView',
  LOGIN = 'login',
  LOGOUT = 'logout',
  LEVEL = 'level',
  COMPLETE_PLAN = 'completePlan',
  /* Student About Me Page */
  PICTURE = 'picture',
  WEBSITE = 'website',
  SHARE_INFORMATION = 'shareInformation',
  /* Degree Planner */
  // Dragging a course/opportunity to the planner
  ADD_COURSE = 'addCourse',
  ADD_OPPORTUNITY = 'addOpportunity',
  // Moving a course/opportunity from a term to another term
  UPDATE_COURSE = 'updateCourse',
  UPDATE_OPPORTUNITY = 'updateOpportunity',
  // Removing a course/opportunity from the planner
  REMOVE_COURSE = 'removeCourse',
  REMOVE_OPPORTUNITY = 'removeOpportunity',
  // Profile entities
  ADD_TO_PROFILE = 'addToProfile',
  REMOVE_FROM_PROFILE = 'removeFromProfile',
  /* Reviews */
  ADD_REVIEW = 'addReview',
  EDIT_REVIEW = 'editReview',
  /* Degree Planner */
  VERIFY_REQUEST = 'verifyRequest',
}

// Default string if we do not need to store a typeData for that User Interaction
export const USER_INTERACTIONS_NO_TYPE_DATA = 'N/A';
