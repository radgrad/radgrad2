/** Define Sort keys used to sort the cards in the explorer pages. It is used in Interests, Career Goals, Opportunities and Courses component */
export const enum EXPLORER_SORT_KEYS {
  MOST_RECENT = 'Most Recent',
  ALPHABETIC = 'Alphabetic',
  RECOMMENDED = 'Recommended',
  INNOVATION = 'Innovation',
  EXPERIENCE =  'Experience',
}

/** Define each ExplorerType in the system, this is different from the EXPLORER_TYPE defined in route-constants.ts. This is used for Interests, CareerGoals, Opportunities and Courses pages and components */
export const enum EXPLORER_TYPE {
  CAREERGOALS = 'career-goals',
  COURSES = 'courses',
  INTERESTS = 'interests',
  OPPORTUNITIES = 'opportunities',
}

/** Define icon names for each explorer type */
export const enum EXPLORER_TYPE_ICON {
  INTEREST = 'heart',
  CAREERGOAL = 'briefcase',
  OPPORTUNITY = 'lightbulb',
  COURSE = 'book',
}

/** Define Sort keys used to sort the cards in the explorer pages. It is used in Interests, Career Goals, Opportunities and Courses component */
export const enum EXPLORER_FILTER_KEYS {
  NONE = 'All',
  THREEHUNDREDPLUS = '300+',
  FOURHUNDREDPLUS = '400+',
  SIXHUNDREDPLUS = '600+',
  INPROFILE = 'In Profile',
  NOTINPROFILE = 'Not in Profile',
}
