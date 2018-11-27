/**
 * This object holds all the routes for RadGrad2. The keys are the Roles the values are an array of route information.
 * Route information consists of a path, the path to the component, a Component to render.
 */
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
import LandingAcademicPlansCardExplorerContainer from '../../ui/pages/landing/LandingAcademicPlansCardExplorer';
import LandingAcademicPlanExplorerContainer from '../../ui/pages/landing/LandingAcademicPlanExplorer';
import AdminHomePageContainer from '../../ui/pages/admin/AdminHomePage';
import AdminDataModelPageContainer from '../../ui/pages/admin/AdminDataModelPage';
import AdminDatabasePageContainer from '../../ui/pages/admin/AdminDatabasePage';
import AdminModerationPageContainer from '../../ui/pages/admin/AdminModerationPage';
import AdminAnalyticsPageContainer from '../../ui/pages/admin/AdminAnalyticsPage';
import AdminCourseScoreboardPageContainer from '../../ui/pages/admin/AdminCourseScoreboardPage';
import AdvisorHomePageContainer from '../../ui/pages/advisor/AdvisorHomePage';
import AdvisorVerificationRequestPageContainer from '../../ui/pages/advisor/AdvisorVerificationRequestPage';
import AdvisorModerationPageContainer from '../../ui/pages/advisor/AdvisorModerationPage';
import AdvisorAcademicPlanPageContainer from '../../ui/pages/advisor/AdvisorAcademicPlanPage';
import AdvisorCourseScoreboardPageContainer from '../../ui/pages/advisor/AdvisorCourseScoreboardPage';
import FacultyVerificationPageContainer from '../../ui/pages/faculty/FacultyVerificationPage';
import FacultyHomePageContainer from '../../ui/pages/faculty/FacultyHomePage';
import FacultyManageOpportunitiesPageContainer from '../../ui/pages/faculty/FacultyManageOpportunitiesPage';
import FacultyCourseScoreboardPageContainer from '../../ui/pages/faculty/FacultyCourseScoreboardPage';
import FacultyExplorerPageContainer from '../../ui/pages/faculty/FacultyExplorerPage';

export const routes = {
  ADMIN: [
    {
      path: '/admin/:username/home',
      exact: true,
      component: AdminHomePageContainer,
    },
    {
      path: '/admin/:username/datamodel',
      exact: true,
      component: AdminDataModelPageContainer,
    },
    {
      path: '/admin/:username/database',
      exact: true,
      component: AdminDatabasePageContainer,
    },
    {
      path: '/admin/:username/moderation',
      exact: true,
      component: AdminModerationPageContainer,
    },
    {
      path: '/admin/:username/analytics',
      exact: true,
      component: AdminAnalyticsPageContainer,
    },
    {
      path: '/admin/:username/course-scoreboard',
      exact: true,
      component: AdminCourseScoreboardPageContainer,
    },
  ],
  ADVISOR: [
    {
      path: '/advisor/:username/home',
      component: AdvisorHomePageContainer,
    },
    {
      path: '/advisor/:username/verification-requests',
      component: AdvisorVerificationRequestPageContainer,
    },
    {
      path: '/advisor/:username/moderation',
      component: AdvisorModerationPageContainer,
    },
    {
      path: '/advisor/:username/academic-plan',
      component: AdvisorAcademicPlanPageContainer,
    },
    {
      path: '/advisor/:username/course-scoreboard',
      component: AdvisorCourseScoreboardPageContainer,
    },
  ],
  FACULTY: [
    {
      path: '/faculty/:username/home',
      component: FacultyHomePageContainer,
    },
    {
      path: '/faculty/:username/verification-requests',
      component: FacultyVerificationPageContainer,
    },
    {
      path: '/faculty/:username/manage-opportunities',
      component: FacultyManageOpportunitiesPageContainer,
    },
    {
      path: '/faculty/:username/explorer',
      component: FacultyExplorerPageContainer,
    },
    {
      path: '/faculty/:username/course-scoreboard',
      component: FacultyCourseScoreboardPageContainer,
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
    {
      path: '/explorer/academic-plans',
      exact: true,
      component: LandingAcademicPlansCardExplorerContainer,
    },
    {
      path: '/explorer/academic-plans/:plan',
      exact: false,
      component: LandingAcademicPlanExplorerContainer,
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
