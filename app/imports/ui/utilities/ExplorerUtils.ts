/** Define Sort keys used to sort the cards in the explorer pages. It is used in Interests, Career Goals, Opportunities and Courses component */
export const enum EXPLORER_SORT_KEYS {
  ALPHABETIC = 'Alphabetic',
  EXPERIENCE =  'Experience',
  INNOVATION = 'Innovation',
  MOST_RECENT = 'Most Recent',
  NUMBER = 'Course Number',
  RECOMMENDED = 'Recommended',
}

/** Define each ExplorerType in the system, this is different from the EXPLORER_TYPE defined in route-constants.ts. This is used for Interests, CareerGoals, Opportunities and Courses pages and components */
export const enum EXPLORER_TYPE {
  CAREERGOALS = 'career-goals',
  COURSES = 'courses',
  INTERESTS = 'interests',
  OPPORTUNITIES = 'opportunities',
  INTERNSHIPS = 'internships',
}

/** Define icon names for each explorer type */
export const enum EXPLORER_TYPE_ICON {
  CAREERGOAL = 'briefcase',
  COURSE = 'book',
  INTEREST = 'heart',
  OPPORTUNITY = 'lightbulb',
  INTERNSHIP = 'mug hot',
}

/** Define Sort keys used to sort the cards in the explorer pages. It is used in Interests, Career Goals, Opportunities and Courses component */
export const enum EXPLORER_FILTER_KEYS {
  NONE = 'All',
  THREEHUNDRED = '3XX',
  FOURHUNDRED = '4XX',
  SIXHUNDRED = '6XX',
  INPROFILE = 'In Profile',
  NOTINPROFILE = 'Not in Profile',
}
