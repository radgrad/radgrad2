// UserInteraction Types
export const USERINTERACTIONSTYPE = {
  PAGEVIEW: 'pageView',
  LOGIN: 'login',
  LEVEL: 'level',
  COMPLETEPLAN: 'completePlan',
  /* Student About Me Page */
  PICTURE: 'picture',
  WEBSITE: 'website',
  SHAREINFORMATION: 'shareInformation',
  /* Favorites */
  FAVACADEMICPLAN: 'favoriteAcademicPlan',
  FAVCAREERGOAL: 'favoriteCareerGoal',
  FAVCOURSE: 'favoriteCourse',
  FAVINTEREST: 'favoriteInterest',
  FAVOPPORTUNITY: 'favoriteOpportunity',
  UNFAVACADEMICPLAN: 'unfavoriteAcademicPlan',
  UNFAVCAREERGOAL: 'unfavoriteCareerGoal',
  UNFAVCOURSE: 'unfavoriteCourse',
  UNFAVINTEREST: 'unfavoriteInterest',
  UNFAVOPPORTUNITY: 'unfavoriteOpportunity',
  /* Course/Opportunity Reviews */
  ADDREVIEW: 'addReview',
  EDITREVIEW: 'editReview',
};

// type for interactionData object
export type USERINTERACTIONDATATYPE = {
  username: string;
  type: string;
  typeData: string | string[];
}

// Default string if we do not need to store a typeData for that User Interaction
export const USERINTERACTIONSNOTYPEDATA = 'N/A';
