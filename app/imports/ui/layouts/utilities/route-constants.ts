// Widely used params as constants
import { ROLE } from '../../../api/role/Role';

export const USERNAME = ':username';
export const HOME = 'home';
export const CHECKLISTS = 'checklists';
export const DEGREEPLANNER = 'degree-planner';
export const GUIDEDTOUR = 'guidedtour';
export const DATAMODEL = 'datamodel';
export const MODERATION = 'moderation';
export const SCOREBOARD = 'scoreboard';
export const COURSE_SCOREBOARD = `course-${SCOREBOARD}`;
export const OPPORTUNITY_SCOREBOARD = `opportunity-${SCOREBOARD}`;
export const PAGE_TRACKING_SCOREBOARD = 'page-tracking-scoreboard';
export const PAGE_TRACKING_COMPARISON = 'page-tracking-comparison';

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

export const COMMUNITY = {
  HOME: 'community',
  USERS: 'users',
  RADGRADVIDEOS: 'radgrad-videos',
};
