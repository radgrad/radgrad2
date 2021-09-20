// Widely used params as constants
import { ROLE } from '../../../api/role/Role';

export const COMMUNITY = 'community';
export const DEGREEPLANNER = 'degree-planner';
export const HOME = 'home';
export const ICE = 'ice';
export const LEVELS = 'levels';
export const VISIBILITY = 'visibility';
export const FORECASTS = 'forecasts';
export const STUDENT_REVIEWS = 'student-reviews';
export const STUDENT_VERIFICATION = 'student-verification';
export const USERNAME = ':username';
export const VERIFICATION_REQUESTS = 'verification-requests';
export const TERMS_AND_CONDITIONS = 'terms-and-conditions';

export const MANAGE = {
  OPPORTUNITIES: 'manage-opportunities',
  REVIEWS: 'manage-reviews',
  VERIFICATION: 'manage-verification',
  STUDENTS: 'manage-students',
  DATABASE: 'manage-database',
  INTERNSHIPS: 'manage-internships',
};

export const ANALYTICS = {
  NEWSLETTER: 'analytics/newsletter',
  BEHAVIOR_TABLE: 'analytics/behavior-table',
  LOGGED_IN_USERS: 'analytics/logged-in-users',
};

export const DATAMODEL = {
  HOME: 'datamodel',
  ACADEMIC_TERMS: 'datamodel/academic-terms',
  ACADEMIC_YEAR_INSTANCES: 'datamodel/academic-year-instances',
  CAREERGOALS: 'datamodel/career-goals',
  COURSE_INSTANCES: 'datamodel/course-instances',
  COURSES: 'datamodel/courses',
  INTERESTS: 'datamodel/interests',
  INTEREST_KEYWORDS: 'datamodel/interests-keywords',
  INTEREST_TYPES: 'datamodel/interest-types',
  INTERNSHIPS: 'datamodel/internships',
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
  INTERNSHIPS: 'explorer/internships',
  OPPORTUNITIES: 'explorer/opportunities',
  CAREERGOALS_PARAM: 'explorer/career-goals/:careergoal',
  COURSES_PARAM: 'explorer/courses/:course',
  INTERESTS_PARAM: 'explorer/interests/:interest',
  INTERNSHIPS_PARAM: 'explorer/internships/:internshipKey',
  OPPORTUNITIES_PARAM: 'explorer/opportunities/:opportunity',
};

// This EXPLORER_TYPE is different from the EXPLORERTYPE in ExplorerUtils.ts
export const EXPLORER_TYPE = {
  HOME: 'explorer',
  CAREERGOALS: 'career-goals',
  COURSES: 'courses',
  INTERESTS: 'interests',
  OPPORTUNITIES: 'opportunities',
  FACULTY: 'faculty',
  INTERNSHIPS: 'internships',
};
