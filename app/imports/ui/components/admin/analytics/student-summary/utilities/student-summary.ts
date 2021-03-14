export interface StudentSummaryBehaviorCategory {
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
  COMPLETE_PLAN = 'Complete Plan',
  PROFILE = 'Profile',
  ADD_TO_PROFILE = 'Add Item to Profile',
  REMOVE_FROM_PROFILE = 'Remove Item from Profile',
  LOGOUT = 'Log Out',
}

export interface StudentSummaryBehaviors {
  LOGIN: StudentSummaryBehaviorCategory;
  OUTLOOK: StudentSummaryBehaviorCategory;
  EXPLORATION: StudentSummaryBehaviorCategory;
  PLANNING: StudentSummaryBehaviorCategory;
  VERIFICATION: StudentSummaryBehaviorCategory;
  REVIEWING: StudentSummaryBehaviorCategory;
  LEVEL: StudentSummaryBehaviorCategory;
  COMPLETE_PLAN: StudentSummaryBehaviorCategory;
  PROFILE: StudentSummaryBehaviorCategory;
  ADD_TO_PROFILE: StudentSummaryBehaviorCategory;
  REMOVE_FROM_PROFILE: StudentSummaryBehaviorCategory;
  LOGOUT: StudentSummaryBehaviorCategory;
  keys: () => string[];
}

export const behaviorCategories: StudentSummaryBehaviors = {
  LOGIN: {
    count: 0,
    users: [],
    description: 'Logged into Application',
  },
  OUTLOOK: {
    count: 0,
    users: [],
    description: 'Updated Interests, Career Goals, or Academic Plans',
  },
  EXPLORATION: {
    count: 0,
    users: [],
    description: 'Viewed entries in Explorer',
  },
  PLANNING: {
    count: 0,
    users: [],
    description: 'Added, removed, or updated Course/Opportunity',
  },
  VERIFICATION: {
    count: 0,
    users: [],
    description: 'Requested Verification',
  },
  REVIEWING: {
    count: 0,
    users: [],
    description: 'Reviewed a Course/Opportunity',
  },
  LEVEL: {
    count: 0,
    users: [],
    description: 'Leveled up',
  },
  COMPLETE_PLAN: {
    count: 0,
    users: [],
    description: 'Created a plan with 100 ICE',
  },
  PROFILE: {
    count: 0,
    users: [],
    description: 'Updated profile picture or website URL',
  },
  ADD_TO_PROFILE: {
    count: 0,
    users: [],
    description: 'Added an item to their profile',
  },
  REMOVE_FROM_PROFILE: {
    count: 0,
    users: [],
    description: 'Removed an item from their profile',
  },
  LOGOUT: {
    count: 0,
    users: [],
    description: 'Logged out',
  },
  keys: () => ['LOGIN', 'OUTLOOK', 'EXPLORATION', 'PLANNING', 'VERIFICATION', 'REVIEWING', 'LEVEL', 'COMPLETE_PLAN', 'PROFILE', 'ADD_TO_PROFILE', 'REMOVE_FROM_PROFILE', 'LOGOUT'],
};
