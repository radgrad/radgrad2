export interface StudentSummaryBehaviorCategory {
  type: string;
  count: number;
  users: string[];
  description: string;
}

export enum StudentSummaryBehaviorTypes {
  LOGIN = 'Log In',
  OUTLOOK = 'Change Outlook',
  EXPLORATION = 'Exploration',
  PLANNING = 'Planning',
  VERIFICATION = 'Verification',
  REVIEWING = 'Reviewing',
  LEVEL = 'Level Up',
  COMPLETEPLAN = 'Complete Plan',
  PROFILE = 'Profile',
  FAVORITE = 'Favorite Item',
  UNFAVORITE = 'Unfavorite Item',
  LOGOUT = 'Log Out',
}

export const behaviorCategories: StudentSummaryBehaviorCategory[] = [
  { type: 'Log In', count: 0, users: [], description: 'Logged into Application' },
  { type: 'Change Outlook', count: 0, users: [], description: 'Updated Interests, Career Goals, or Academic Plans' },
  { type: 'Exploration', count: 0, users: [], description: 'Viewed entries in Explorer' },
  { type: 'Planning', count: 0, users: [], description: 'Added, removed, or updated Course/Opportunity' },
  { type: 'Verification', count: 0, users: [], description: 'Requested Verification' },
  { type: 'Reviewing', count: 0, users: [], description: 'Reviewed a Course/Opportunity' },
  { type: 'Level Up', count: 0, users: [], description: 'Leveled up' },
  { type: 'Complete Plan', count: 0, users: [], description: 'Created a plan with 100 ICE' },
  { type: 'Profile', count: 0, users: [], description: 'Updated profile picture or website URL' },
  { type: 'Favorite Item', count: 0, users: [], description: 'Favorited an item' },
  { type: 'Unfavorite Item', count: 0, users: [], description: 'Unfavorited an item' },
  { type: 'Log Out', count: 0, users: [], description: 'Logged out' },
];
