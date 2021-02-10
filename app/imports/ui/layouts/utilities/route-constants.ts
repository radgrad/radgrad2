// Widely used params as constants
import { ROLE } from '../../../api/role/Role';

export const DATAMODEL = 'datamodel';
export const DEGREEPLANNER = 'degree-planner';
export const HOME = 'home';
export const ICE = 'ice';
export const LEVELS = 'levels';
export const PRIVACY = 'privacy';
export const MODERATION = 'moderation';
export const COMMUNITY = 'community';
export const SCOREBOARD = 'scoreboard';
export const COURSE_SCOREBOARD = `course-${SCOREBOARD}`;
export const OPPORTUNITY_SCOREBOARD = `opportunity-${SCOREBOARD}`;
export const USERNAME = ':username';
export const PAGE_TRACKING_SCOREBOARD = 'page-tracking-scoreboard';
export const PAGE_TRACKING_COMPARISON = 'page-tracking-comparison';
export const STUDENT_REVIEWS = 'student-reviews';
export const STUDENT_VERIFICATION = 'student-verification';

export const ANALYTICS = {
  HOME: 'analytics',
  NEWSLETTER: 'newsletter',
  OVERHEADANALYSIS: 'overhead-analysis',
  STUDENTSUMMARY: 'student-summary',
  USERINTERACTIONS: 'user-interactions',
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
