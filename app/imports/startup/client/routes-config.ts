/**
 * This object holds all the routes for RadGrad2. The keys are the Roles the values are an array of route information.
 * Route information consists of a path, the path to the component, a Component to render.
 */
import LandingHomeContainer from '../../ui/pages/landing/LandingHome';
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
import StudentHomePageContainer from '../../ui/pages/student/StudentHomePage';
import StudentDegreePlannerPageContainer from '../../ui/pages/student/StudentDegreePlannerPage';
import StudentMentorSpacePageContainer from '../../ui/pages/student/StudentMentorSpacePage';
import StudentExplorerPageContainer from '../../ui/pages/student/StudentExplorerPage';
import MentorHomePageContainer from '../../ui/pages/mentor/MentorHomePage';
import MentorMentorSpacePageContainer from '../../ui/pages/mentor/MentorMentorSpacePage';
import MentorExplorerPageContainer from '../../ui/pages/mentor/MentorExplorerPage';
import AlumniHomePageContainer from '../../ui/pages/alumni/AlumniHomePage';
import AdminDumpDatabasePageContainer from '../../ui/pages/admin/AdminDumpDatabasePage';
import AdminCheckDatabaseIntegrityPageContainer from '../../ui/pages/admin/AdminCheckDatabaseIntegrityPage';
import AdminDataModelAcademicPlansPage from '../../ui/pages/admin/AdminDataModelAcademicPlansPage';
import AdminDataModelAcademicTermsPage from '../../ui/pages/admin/AdminDataModelAcademicTermsPage';
import AdminDataModelAcademicYearsPage from '../../ui/pages/admin/AdminDataModelAcademicYearsPage';
import AdminDataModelAdvisorLogsPage from '../../ui/pages/admin/AdminDataModelAdvisorLogsPage';
import AdminDataModelCareerGoalsPage from '../../ui/pages/admin/AdminDataModelCareerGoalsPage';
import AdminDataModelUsersPage from '../../ui/pages/admin/AdminDataModelUsersPage';
import AdminDataModelCourseInstancesPage from '../../ui/pages/admin/AdminDataModelCourseInstancesPage';
import AdminDataModelCoursesPage from '../../ui/pages/admin/AdminDataModelCoursesPage';
import AdminDataModelDesiredDegreesPage from '../../ui/pages/admin/AdminDataModelDesiredDegreePage';
import AdminDataModelFeedsPage from '../../ui/pages/admin/AdminDataModelFeedsPage';
import AdminDataModelFeedbackInstancesPage from '../../ui/pages/admin/AdminDataModelFeedbackInstancesPage';
import AdminDataModelHelpMessagesPage from '../../ui/pages/admin/AdminDataModelHelpMessagesPage';
import AdminDataModelInterestsPage from '../../ui/pages/admin/AdminDataModelInterestsPage';
import AdminDataModelInterestTypesPage from '../../ui/pages/admin/AdminDataModelInterestTypesPage';
import AdminDataModelMentorAnswerPage from '../../ui/pages/admin/AdminDataModelMentorAnswerPage';
import AdminDataModelMentorQuestionPage from '../../ui/pages/admin/AdminDataModelMentorQuestionPage';
import AdminDataModelOpportunitiesPage from '../../ui/pages/admin/AdminDataModelOpportunitiesPage';
import AdminDataModelOpportunityInstancesPage from '../../ui/pages/admin/AdminDataModelOpportunityInstancesPage';
import AdminDataModelOpportunityTypesPage from '../../ui/pages/admin/AdminDataModelOpportunityTypesPage';
import AdminDataModelPlanChoicesPage from '../../ui/pages/admin/AdminDataModelPlanChoicesPage';
import AdminDataModelReviewsPage from '../../ui/pages/admin/AdminDataModelReviewsPage';
import AdminDataModelSlugsPage from '../../ui/pages/admin/AdminDataModelSlugsPage';
import AdminDataModelTeasersPage from '../../ui/pages/admin/AdminDataModelTeasersPage';
import AdminDataModelVerificationRequestsPage from '../../ui/pages/admin/AdminDataModelVerificationRequestsPage';
import InterestExplorerPageContainer from "../../ui/pages/shared/InterestExplorer";
import CardExplorerPageContainer from '../../ui/pages/shared/CardExplorerPage';
import ExplorerDegreesPageContainer from '../../ui/pages/shared/ExplorerDegreesPage';

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
      path: '/admin/:username/datamodel/academic-plans',
      exact: true,
      component: AdminDataModelAcademicPlansPage,
    },
    {
      path: '/admin/:username/datamodel/academic-terms',
      exact: true,
      component: AdminDataModelAcademicTermsPage,
    },
    {
      path: '/admin/:username/datamodel/academic-year-instances',
      exact: true,
      component: AdminDataModelAcademicYearsPage,
    },
    {
      path: '/admin/:username/datamodel/advisor-logs',
      exact: true,
      component: AdminDataModelAdvisorLogsPage,
    },
    {
      path: '/admin/:username/datamodel/career-goals',
      exact: true,
      component: AdminDataModelCareerGoalsPage,
    },
    {
      path: '/admin/:username/datamodel/course-instances',
      exact: true,
      component: AdminDataModelCourseInstancesPage,
    },
    {
      path: '/admin/:username/datamodel/courses',
      exact: true,
      component: AdminDataModelCoursesPage,
    },
    {
      path: '/admin/:username/datamodel/desired-degrees',
      exact: true,
      component: AdminDataModelDesiredDegreesPage,
    },
    {
      path: '/admin/:username/datamodel/feeds',
      exact: true,
      component: AdminDataModelFeedsPage,
    },
    {
      path: '/admin/:username/datamodel/feedback-instances',
      exact: true,
      component: AdminDataModelFeedbackInstancesPage,
    },
    {
      path: '/admin/:username/datamodel/help-messages',
      exact: true,
      component: AdminDataModelHelpMessagesPage,
    },
    {
      path: '/admin/:username/datamodel/interests',
      exact: true,
      component: AdminDataModelInterestsPage,
    },
    {
      path: '/admin/:username/datamodel/interest-types',
      exact: true,
      component: AdminDataModelInterestTypesPage,
    },
    {
      path: '/admin/:username/datamodel/mentor-answers',
      exact: true,
      component: AdminDataModelMentorAnswerPage,
    },
    {
      path: '/admin/:username/datamodel/mentor-questions',
      exact: true,
      component: AdminDataModelMentorQuestionPage,
    },
    {
      path: '/admin/:username/datamodel/opportunities',
      exact: true,
      component: AdminDataModelOpportunitiesPage,
    },
    {
      path: '/admin/:username/datamodel/opportunity-instances',
      exact: true,
      component: AdminDataModelOpportunityInstancesPage,
    },
    {
      path: '/admin/:username/datamodel/opportunity-types',
      exact: true,
      component: AdminDataModelOpportunityTypesPage,
    },
    {
      path: '/admin/:username/datamodel/plan-choices',
      exact: true,
      component: AdminDataModelPlanChoicesPage,
    },
    {
      path: '/admin/:username/datamodel/reviews',
      exact: true,
      component: AdminDataModelReviewsPage,
    },
    {
      path: '/admin/:username/datamodel/slugs',
      exact: true,
      component: AdminDataModelSlugsPage,
    },
    {
      path: '/admin/:username/datamodel/teasers',
      exact: true,
      component: AdminDataModelTeasersPage,
    },
    {
      path: '/admin/:username/datamodel/users',
      exact: true,
      component: AdminDataModelUsersPage,
    },
    {
      path: '/admin/:username/datamodel/verification-requests',
      exact: true,
      component: AdminDataModelVerificationRequestsPage,
    },
    {
      path: '/admin/:username/database',
      exact: true,
      component: AdminDatabasePageContainer,
    },
    {
      path: '/admin/:username/database/dump',
      exact: true,
      component: AdminDumpDatabasePageContainer,
    },
    {
      path: '/admin/:username/database/integrity-check',
      exact: true,
      component: AdminCheckDatabaseIntegrityPageContainer,
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
  ALUMNI: [
    {
      path: '/alumni/:username/home',
      component: AlumniHomePageContainer,
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
      exact: true,
      component: FacultyExplorerPageContainer,
    },
    {
      path: '/faculty/:username/explorer/degrees',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/faculty/:username/explorer/plans',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/faculty/:username/explorer/career-goals',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/faculty/:username/explorer/courses',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/faculty/:username/explorer/degrees',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/faculty/:username/explorer/degrees/:degree',
      exact: true,
      component: ExplorerDegreesPageContainer,
    },
    {
      path: '/faculty/:username/explorer/interests',
      exact: true,
      component: CardExplorerPageContainer,
    }, {

      path: '/faculty/:username/explorer/interests/:interest',
      exact: true,
      component: InterestExplorerPageContainer,
    },
    {
      path: '/faculty/:username/explorer/opportunities',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/faculty/:username/explorer/users',
      exact: true,
      component: CardExplorerPageContainer,
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
      component: MentorHomePageContainer,
    },
    {
      path: '/mentor/:username/mentor-space',
      component: MentorMentorSpacePageContainer,
    },
    {
      path: '/mentor/:username/explorer',
      exact: true,
      component: MentorExplorerPageContainer,
    },
    {
      path: '/mentor/:username/explorer/interests',
      exact: true,
      component: InterestExplorerPageContainer,
    },
    {
      path: '/mentor/:username/explorer/plans',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/mentor/:username/explorer/career-goals',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/mentor/:username/explorer/courses',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/mentor/:username/explorer/degrees',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/mentor/:username/explorer/degrees/:degree',
      exact: true,
      component: ExplorerDegreesPageContainer,
    },
    {
      path: '/mentor/:username/explorer/interests',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/mentor/:username/explorer/opportunities',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/mentor/:username/explorer/users',
      exact: true,
      component: CardExplorerPageContainer,
    },
  ],
  STUDENT: [
    {
      path: '/student/:username/home',
      component: StudentHomePageContainer,
    },
    {
      path: '/student/:username/degree-planner',
      component: StudentDegreePlannerPageContainer,
    },
    {
      path: '/student/:username/mentor-space',
      component: StudentMentorSpacePageContainer,
    },
    {
      path: '/student/:username/explorer',
      exact: true,
      component: StudentExplorerPageContainer,
    },
    {
      path: '/student/:username/explorer/plans',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/student/:username/explorer/career-goals',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/student/:username/explorer/courses',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/student/:username/explorer/degrees',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/student/:username/explorer/degrees/:degree',
      exact: true,
      component: ExplorerDegreesPageContainer,
    },
    {
      path: '/student/:username/explorer/interests',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/student/:username/explorer/interests/:interest',
      exact: true,
      component: InterestExplorerPageContainer,
    },
    {
      path: '/student/:username/explorer/opportunities',
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: '/student/:username/explorer/users',
      exact: true,
      component: CardExplorerPageContainer,
    },
  ],
};
