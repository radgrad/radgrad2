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
import GuidedTourAdvisor from '../../ui/pages/landing/GuidedTourAdvisor';
import GuidedTourFaculty from '../../ui/pages/landing/GuidedTourFaculty';
import GuidedTourMentor from '../../ui/pages/landing/GuidedTourMentor';
import GuidedTourStudentContainer from '../../ui/pages/landing/GuidedTourStudent';
import CareerGoalsCardExplorerContainer from '../../ui/pages/landing/CareerGoalsCardExplorer';

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
      routeName: 'Landing_Page',
      component: LandingHomeContainer,
    },
    {
      path: '/guidedtour/student',
      routeName: 'Student_Guided_Tour_Page',
      component: GuidedTourStudentContainer,
    },
    {
      path: '/guidedtour/advisor',
      routeName: 'Advisor_Guided_Tour_Page',
      component: GuidedTourAdvisor,
    },
    {
      path: '/guidedtour/faculty',
      routeName: 'Faculty_Guided_Tour_Page',
      component: GuidedTourFaculty,
    },
    {
      path: '/guidedtour/mentor',
      routeName: 'Mentor_Guided_Tour_Page',
      component: GuidedTourMentor,
    },
    {
      path: '/explorer/career-goals',
      routeName: 'Landing_Card_Explorer_CareerGoals_Page',
      component: CareerGoalsCardExplorerContainer,
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
