/**
 * This object holds all the routes for RadGrad2. The keys are the Roles the values are an array of route information.
 * Route information consists of a path, the path to the component, a Component to render.
 */
import AdminHome from '../../ui/pages/admin/AdminHome';
import AdvisorHome from '../../ui/pages/advisor/AdvisorHome';
import FacultyHome from '../../ui/pages/faculty/FacultyHome';
import LandingHomeContainer from '../../ui/pages/landing/LandingHome';
import MentorHome from '../../ui/pages/mentor/MentorHome';
import StudentHome from '../../ui/pages/student/StudentHome';

export const routes = {
  ADMIN: [
    {
      path: '/admin/:username/home',
      component: AdminHome,
    },
  ],
  ADVISOR: [
    {
      path: '/advisor/:username/home',
      component: AdvisorHome,
    },
  ],
  FACULTY: [
    {
      path: '/faculty/:username/home',
      component: FacultyHome,
    },
  ],
  LANDING: [
    {
      path: '/',
      component: LandingHomeContainer,
    },
  ],
  MENTOR: [
    {
      path: '/mentor/:username/home',
      component: MentorHome,
    },
  ],
  STUDENT: [
    {
      path: '/student/:username/home',
      component: StudentHome,
    },
  ],
};
