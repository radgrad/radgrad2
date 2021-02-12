// Widely used params as constants
import { ROLE } from '../../../api/role/Role';

export const COMMUNITY = 'community';
export const DEGREEPLANNER = 'degree-planner';
export const HOME = 'home';
export const ICE = 'ice';
export const LEVELS = 'levels';
export const PRIVACY = 'privacy';
export const FORECASTS = 'forecasts';
export const STUDENT_REVIEWS = 'student-reviews';
export const STUDENT_VERIFICATION = 'student-verification';
export const USERNAME = ':username';
export const VERIFICATION_REQUESTS = 'verification-requests';

export const MANAGE = {
  OPPORTUNITIES: 'manage-opportunities',
  REVIEWS: 'manage-reviews',
  VERIFICATIONS: 'manage-verifications',
  STUDENTS: 'manage-students',
};

export const ANALYTICS = {
  HOME: 'analytics',
  NEWSLETTER: 'analytics/newsletter',
  OVERHEAD_ANALYSIS: 'analytics/overhead-analysis',
  STUDENT_SUMMARY: 'analytics/student-summary',
  USER_INTERACTIONS: 'analytics/user-interactions',
};

export const DATABASE = {
  HOME: 'database',
  DUMP: 'database/dump',
  INTEGRITY_CHECK: 'database/integrity-check',
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

export const EXPLORER_TYPE = {
  HOME: 'explorer',
  CAREERGOALS: 'career-goals',
  COURSES: 'courses',
  INTERESTS: 'interests',
  OPPORTUNITIES: 'opportunities',
  FACULTY: 'faculty',
};
