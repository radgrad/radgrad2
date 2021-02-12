// Widely used params as constants
import { ROLE } from '../../../api/role/Role';

export const COMMUNITY = 'community';
export const COURSE_SCOREBOARD = 'course-scoreboard';
export const DEGREEPLANNER = 'degree-planner';
export const HOME = 'home';
export const ICE = 'ice';
export const LEVELS = 'levels';
export const MANAGE_STUDENTS = 'manage-students';
export const MANAGE_VERIFICATIONS = 'manage-verifications';
export const MANAGE_REVIEWS = 'review-moderation';
export const MODERATION = 'moderation';
export const OPPORTUNITY_SCOREBOARD = 'opportunity-scoreboard';
export const PAGE_TRACKING_SCOREBOARD = 'page-tracking-scoreboard';
export const PAGE_TRACKING_COMPARISON = 'page-tracking-comparison';
export const PRIVACY = 'privacy';
export const SCOREBOARD = 'scoreboard';
export const STUDENT_REVIEWS = 'student-reviews';
export const STUDENT_VERIFICATION = 'student-verification';
export const USERNAME = ':username';

export const ANALYTICS = {
  HOME: 'analytics',
  NEWSLETTER: 'newsletter',
  OVERHEADANALYSIS: 'overhead-analysis',
  STUDENTSUMMARY: 'student-summary',
  USERINTERACTIONS: 'user-interactions',
};

export const DATAMODEL = {
  HOME: 'datamodel',
  ACADEMIC_TERMS: 'datamodel/academic-terms',
  ACADEMIC_YEAR_INSTANCES: 'datamodel/academic-year-instances',
  CAREERGOALS: 'datamodel/careergoals',
  COURSE_INSTANCES: 'datamodel/course-instances',
  COURSES: 'datamodel/courses',
  FEEDS: 'datamodel/feeds',
  FEEDBACK_INSTANCES: 'datamodel/feedback-instances',
  HELP_MESSAGES: 'datamodel/help-messages',
  INTERESTS: 'datamodel/interests',
  INTEREST_TYPES: 'datamodel/interest-types',
  OPPORTUNITIES: 'datamodel/opportunities',
  OPPORTUNITY_INSTANCES: 'datamodel/opportunity-instances',
  OPPORTUNITY_TYPES: 'datamodel/opportunity-types',
  REVIEWS: 'datamodel/reviews',
  SLUGS: 'datamodel/slugs',
  TEASERS: 'datamodel/teasers',
  USERS: 'datamodel/users',
  VERIFICATION_REQUESTS: 'datamodel/verification-requests',
};

// The roles based on the URL (i.e., /student/abi@hawaii => the role is student)
export const URL_ROLES = {
  ADMIN: ROLE.ADMIN.toLowerCase(),
  ADVISOR: ROLE.ADVISOR.toLowerCase(),
  ALUMNI: ROLE.ALUMNI.toLowerCase(),
  FACULTY: ROLE.FACULTY.toLowerCase(),
  STUDENT: ROLE.STUDENT.toLowerCase(),
};

export const EXPLORER_TYPE = {
  HOME: 'explorer',
  CAREERGOALS: 'career-goals',
  COURSES: 'courses',
  INTERESTS: 'interests',
  OPPORTUNITIES: 'opportunities',
  FACULTY: 'faculty',
};

export const EXPLORER_PARAM = {
  CAREERGOAL: ':careergoal',
  COURSE: ':course',
  INTEREST: ':interest',
  OPPORTUNITY: ':opportunity',
  FACULTY: ':faculty',
};

export const EXPLORER = {
  HOME: 'explorer',
  CAREERGOALS: 'explorer/career-goals',
  COURSES: 'explorer/courses',
  INTERESTS: 'explorer/interests',
  OPPORTUNITIES: 'explorer/opportunities',
  CAREERGOALS_PARAM: 'explorer/career-goals/:careergoal',
  COURSES_PARAM: 'explorer/courses/:course',
  INTERESTS_PARAM: 'explorer/interests/:interest',
  OPPORTUNITIES_PARAM: 'explorer/opportunities/:opportunity',
};
