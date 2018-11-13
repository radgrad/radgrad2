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
import LandingCareerGoalsCardExplorerContainer from '../../ui/pages/landing/LandingCareerGoalsCardExplorer';
import LandingCareerGoalExplorerContainer from '../../ui/pages/landing/LandingCareerGoalExplorer';
import LandingCoursesCardExplorerContainer from '../../ui/pages/landing/LandingCoursesCardExplorer';
import LandingCourseExplorerContainer from '../../ui/pages/landing/LandingCourseExplorer';
import LandingDegreesCardExplorerContainer from '../../ui/pages/landing/LandingDegreesCardExplorer';
import LandingDesiredDegreeExplorerContainer from '../../ui/pages/landing/LandingDegreeExplorer';
import LandingInterestsCardExplorerContainer from '../../ui/pages/landing/LandingInterestsCardExplorer';
import LandingInterestExplorerContainer from '../../ui/pages/landing/LandingInterestExplorer';
import LandingOpportunitiesCardExplorerContainer from '../../ui/pages/landing/LandingOpportunitiesCardExplorer';
import LandingOpportunityExplorerContainer from '../../ui/pages/landing/LandingOpportunityExplorer';

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
      exact: true,
      component: LandingHomeContainer,
    },
    {
      path: '/guidedtour/student',
      exact: true,
      component: GuidedTourStudentContainer,
    },
    {
      path: '/guidedtour/advisor',
      exact: true,
      component: GuidedTourAdvisor,
    },
    {
      path: '/guidedtour/faculty',
      exact: true,
      component: GuidedTourFaculty,
    },
    {
      path: '/guidedtour/mentor',
      exact: true,
      component: GuidedTourMentor,
    },
    {
      path: '/explorer/career-goals',
      exact: true,
      component: LandingCareerGoalsCardExplorerContainer,
    },
    {
      path: '/explorer/career-goals/:careergoal',
      exact: false,
      component: LandingCareerGoalExplorerContainer,
    },
    {
      path: '/explorer/courses',
      exact: true,
      component: LandingCoursesCardExplorerContainer,
    },
    {
      path: '/explorer/courses/:course',
      exact: false,
      component: LandingCourseExplorerContainer,
    },
    {
      path: '/explorer/degrees',
      exact: true,
      component: LandingDegreesCardExplorerContainer,
    },
    {
      path: '/explorer/degrees/:degree',
      exact: false,
      component: LandingDesiredDegreeExplorerContainer,
    },
    {
      path: '/explorer/interests',
      exact: true,
      component: LandingInterestsCardExplorerContainer,
    },
    {
      path: '/explorer/interests/:interest',
      exact: false,
      component: LandingInterestExplorerContainer,
    },
    {
      path: '/explorer/opportunities',
      exact: true,
      component: LandingOpportunitiesCardExplorerContainer,
    },
    {
      path: '/explorer/opportunities/:opportunity',
      exact: false,
      component: LandingOpportunityExplorerContainer,
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
