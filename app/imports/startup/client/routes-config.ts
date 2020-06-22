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
import ExplorerHomePageContainer from '../../ui/pages/shared/ExplorerHomePage';
import CardExplorerPageContainer from '../../ui/pages/shared/CardExplorerPage';
import IndividualExplorerPageContainer from '../../ui/pages/shared/IndividualExplorerPage';
import AdminHomePageContainer from '../../ui/pages/admin/AdminHomePage';
import AdminDataModelPageContainer from '../../ui/pages/admin/AdminDataModelPage';
import AdminDatabasePageContainer from '../../ui/pages/admin/AdminDatabasePage';
import AdminModerationPageContainer from '../../ui/pages/admin/AdminModerationPage';
import AdminAnalyticsPageContainer from '../../ui/pages/admin/AdminAnalyticsPage';
import AdminAnalyticsNewsletterPageContainer from '../../ui/pages/admin/AdminAnalyticsNewsletterPage';
import AdminAnalyticsOverheadAnalysisPageContainer from '../../ui/pages/admin/AdminAnalyticsOverheadAnalysisPage';
import AdminAnalyticsStudentSummaryPageContainer from '../../ui/pages/admin/AdminAnalyticsStudentSummaryPage';
import AdminAnalyticsUserInteractionsPageContainer from '../../ui/pages/admin/AdminAnalyticsUserInteractionsPage';
import AdvisorHomePageContainer from '../../ui/pages/advisor/AdvisorHomePage';
import AdvisorVerificationRequestPageContainer from '../../ui/pages/advisor/AdvisorVerificationRequestPage';
import AdvisorModerationPageContainer from '../../ui/pages/advisor/AdvisorModerationPage';
import AdvisorAcademicPlanPageContainer from '../../ui/pages/advisor/AdvisorAcademicPlanPage';
import FacultyVerificationPageContainer from '../../ui/pages/faculty/FacultyVerificationPage';
import FacultyHomePageContainer from '../../ui/pages/faculty/FacultyHomePage';
import FacultyManageOpportunitiesPageContainer from '../../ui/pages/faculty/FacultyManageOpportunitiesPage';
import StudentHomePageContainer from '../../ui/pages/student/StudentHomePage';
import StudentDegreePlannerPage from '../../ui/pages/student/StudentDegreePlannerPage';
import StudentHomeAboutMePageContainer from '../../ui/pages/student/StudentHomeAboutMePage';
import StudentHomeIcePageContainer from '../../ui/pages/student/StudentHomeIcePage';
import StudentHomeLevelsPageContainer from '../../ui/pages/student/StudentHomeLevelsPage';
import StudentHomeLogPageContainer from '../../ui/pages/student/StudentHomeLogPage';
import StudentMentorSpacePageContainer from '../../ui/pages/student/StudentMentorSpacePage';
import MentorHomePageContainer from '../../ui/pages/mentor/MentorHomePage';
import MentorMentorSpacePageContainer from '../../ui/pages/mentor/MentorMentorSpacePage';
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
import ScoreboardPageContainer from '../../ui/pages/shared/ScoreboardPage';
import {
  URL_ROLES,
  USERNAME,
  HOME,
  DATAMODEL,
  EXPLORER_TYPE,
  MODERATION,
  ANALYTICS,
  SCOREBOARD,
  COURSE_SCOREBOARD,
  OPPORTUNITY_SCOREBOARD,
  EXPLORER_PARAM,
  GUIDEDTOUR,
  MENTOR_SPACE,
  PAGE_TRACKING_SCOREBOARD, PAGE_TRACKING_COMPARISON,
} from './route-constants';
import PageTrackingScoreboardPage from '../../ui/pages/shared/PageTrackingScoreboardPage';
import PageTrackingComparisonPage from '../../ui/pages/shared/PageTrackingComparisonPage';
import { PageInterestsCategoryTypes } from '../../api/page-tracking/PageInterestsCategoryTypes';

export const routes = {
  ADMIN: [
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${HOME}`,
      exact: true,
      component: AdminHomePageContainer,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}`,
      exact: true,
      component: AdminDataModelPageContainer,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/academic-plans`,
      exact: true,
      component: AdminDataModelAcademicPlansPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/academic-terms`,
      exact: true,
      component: AdminDataModelAcademicTermsPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/academic-year-instances`,
      exact: true,
      component: AdminDataModelAcademicYearsPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/advisor-logs`,
      exact: true,
      component: AdminDataModelAdvisorLogsPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/${EXPLORER_TYPE.CAREERGOALS}`,
      exact: true,
      component: AdminDataModelCareerGoalsPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/course-instances`,
      exact: true,
      component: AdminDataModelCourseInstancesPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/${EXPLORER_TYPE.COURSES}`,
      exact: true,
      component: AdminDataModelCoursesPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/desired-degrees`,
      exact: true,
      component: AdminDataModelDesiredDegreesPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/feeds`,
      exact: true,
      component: AdminDataModelFeedsPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/feedback-instances`,
      exact: true,
      component: AdminDataModelFeedbackInstancesPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/help-messages`,
      exact: true,
      component: AdminDataModelHelpMessagesPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/${EXPLORER_TYPE.INTERESTS}`,
      exact: true,
      component: AdminDataModelInterestsPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/interest-types`,
      exact: true,
      component: AdminDataModelInterestTypesPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/mentor-answers`,
      exact: true,
      component: AdminDataModelMentorAnswerPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/mentor-questions`,
      exact: true,
      component: AdminDataModelMentorQuestionPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/${EXPLORER_TYPE.OPPORTUNITIES}`,
      exact: true,
      component: AdminDataModelOpportunitiesPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/opportunity-instances`,
      exact: true,
      component: AdminDataModelOpportunityInstancesPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/opportunity-types`,
      exact: true,
      component: AdminDataModelOpportunityTypesPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/plan-choices`,
      exact: true,
      component: AdminDataModelPlanChoicesPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/reviews`,
      exact: true,
      component: AdminDataModelReviewsPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/slugs`,
      exact: true,
      component: AdminDataModelSlugsPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/teasers`,
      exact: true,
      component: AdminDataModelTeasersPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/${EXPLORER_TYPE.USERS}`,
      exact: true,
      component: AdminDataModelUsersPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/verification-requests`,
      exact: true,
      component: AdminDataModelVerificationRequestsPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/database`,
      exact: true,
      component: AdminDatabasePageContainer,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/database/dump`,
      exact: true,
      component: AdminDumpDatabasePageContainer,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/database/integrity-check`,
      exact: true,
      component: AdminCheckDatabaseIntegrityPageContainer,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${MODERATION}`,
      exact: true,
      component: AdminModerationPageContainer,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${ANALYTICS.HOME}`,
      exact: true,
      component: AdminAnalyticsPageContainer,
    },
    {
      path:
        `/${URL_ROLES.ADMIN}/${USERNAME}/${ANALYTICS.HOME}/${ANALYTICS.NEWSLETTER}`,
      exact: true,
      component:
      AdminAnalyticsNewsletterPageContainer,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${ANALYTICS.HOME}/${ANALYTICS.OVERHEADANALYSIS}`,
      exact: true,
      component:
      AdminAnalyticsOverheadAnalysisPageContainer,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${ANALYTICS.HOME}/${ANALYTICS.STUDENTSUMMARY}`,
      exact: true,
      component:
      AdminAnalyticsStudentSummaryPageContainer,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${ANALYTICS.HOME}/${ANALYTICS.USERINTERACTIONS}`,
      exact: true,
      component:
      AdminAnalyticsUserInteractionsPageContainer,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${SCOREBOARD}`,
      exact: true,
      component:
      ScoreboardPageContainer,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${SCOREBOARD}/${COURSE_SCOREBOARD}`,
      exact: true,
      component:
      ScoreboardPageContainer,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${SCOREBOARD}/${OPPORTUNITY_SCOREBOARD}`,
      exact: true,
      component:
      ScoreboardPageContainer,
    },
    /* ############################## Page Tracking SCOREBOARD ############################## */
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.CAREERGOAL}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.COURSE}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.INTEREST}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.OPPORTUNITY}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    /* ############################## Page Tracking Comparison ############################## */
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.CAREERGOAL}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.COURSE}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.INTEREST}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.OPPORTUNITY}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
  ],
  ADVISOR: [
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${HOME}`,
      component: AdvisorHomePageContainer,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/verification-requests`,
      exact: true,
      component: AdvisorVerificationRequestPageContainer,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${MODERATION}`,
      exacT: true,
      component: AdvisorModerationPageContainer,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/academic-plan`,
      component: AdvisorAcademicPlanPageContainer,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${SCOREBOARD}`,
      exact: true,
      component: ScoreboardPageContainer,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${SCOREBOARD}/${COURSE_SCOREBOARD}`,
      exact: true,
      component: ScoreboardPageContainer,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${SCOREBOARD}/${OPPORTUNITY_SCOREBOARD}`,
      exact: true,
      component: ScoreboardPageContainer,
    },
    /* ############################## Page Tracking SCOREBOARD ############################## */
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.CAREERGOAL}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.COURSE}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.INTEREST}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.OPPORTUNITY}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    /* ############################## Page Tracking Comparison ############################## */
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.CAREERGOAL}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.COURSE}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.INTEREST}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.OPPORTUNITY}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
  ],
  ALUMNI: [
    {
      path: `/${URL_ROLES.ALUMNI}/${USERNAME}/${HOME}`,
      component: AlumniHomePageContainer,
    },
  ],
  FACULTY: [
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${HOME}`,
      component: FacultyHomePageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/verification-requests`,
      exact: true,
      component: FacultyVerificationPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/manage-opportunities`,
      exact: true,
      component: FacultyManageOpportunitiesPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}`,
      exact: true,
      component: ExplorerHomePageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}/${EXPLORER_PARAM.ACADEMICPLAN}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${EXPLORER_PARAM.CAREERGOAL}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${EXPLORER_PARAM.COURSE}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.DEGREES}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.DEGREES}/${EXPLORER_PARAM.DEGREE}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${EXPLORER_PARAM.INTEREST}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${EXPLORER_PARAM.OPPORTUNITY}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.USERS}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${SCOREBOARD}`,
      exact: true,
      component: ScoreboardPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${SCOREBOARD}/${COURSE_SCOREBOARD}`,
      exact: true,
      component: ScoreboardPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${SCOREBOARD}/${OPPORTUNITY_SCOREBOARD}`,
      exact: true,
      component: ScoreboardPageContainer,
    },
    /* ############################## Page Tracking SCOREBOARD ############################## */
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.CAREERGOAL}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.COURSE}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.INTEREST}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.OPPORTUNITY}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    /* ############################## Page Tracking Comparison ############################## */
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.CAREERGOAL}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.COURSE}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.INTEREST}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.OPPORTUNITY}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
  ],
  LANDING: [
    {
      path: '/',
      exact: true,
      component: LandingHomeContainer,
    },
    {
      path: `/${GUIDEDTOUR}/${URL_ROLES.STUDENT}`,
      exact: true,
      component: GuidedTourStudentContainer,
    },
    {
      path: `/${GUIDEDTOUR}/${URL_ROLES.ADVISOR}`,
      exact: true,
      component: GuidedTourAdvisor,
    },
    {
      path: `/${GUIDEDTOUR}/${URL_ROLES.FACULTY}`,
      exact: true,
      component: GuidedTourFaculty,
    },
    {
      path: `/${GUIDEDTOUR}/${URL_ROLES.MENTOR}`,
      exact: true,
      component: GuidedTourMentor,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}`,
      exact: true,
      component: LandingCareerGoalsCardExplorerContainer,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${EXPLORER_PARAM.CAREERGOAL}`,
      exact: false,
      component: LandingCareerGoalExplorerContainer,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}`,
      exact: true,
      component: LandingCoursesCardExplorerContainer,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${EXPLORER_PARAM.COURSE}`,
      exact: false,
      component: LandingCourseExplorerContainer,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.DEGREES}`,
      exact: true,
      component: LandingDegreesCardExplorerContainer,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.DEGREES}/${EXPLORER_PARAM.DEGREE}`,
      exact: false,
      component: LandingDesiredDegreeExplorerContainer,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}`,
      exact: true,
      component: LandingInterestsCardExplorerContainer,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${EXPLORER_PARAM.INTEREST}`,
      exact: false,
      component: LandingInterestExplorerContainer,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}`,
      exact: true,
      component: LandingOpportunitiesCardExplorerContainer,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${EXPLORER_PARAM.OPPORTUNITY}`,
      exact: false,
      component: LandingOpportunityExplorerContainer,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}`,
      exact: true,
      component: LandingAcademicPlansCardExplorerContainer,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}/${EXPLORER_PARAM.ACADEMICPLAN}`,
      exact: false,
      component: LandingAcademicPlanExplorerContainer,
    },
  ],
  MENTOR: [
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${HOME}`,
      component: MentorHomePageContainer,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${MENTOR_SPACE}`,
      component: MentorMentorSpacePageContainer,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${EXPLORER_TYPE.HOME}`,
      exact: true,
      component: ExplorerHomePageContainer,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}/${EXPLORER_PARAM.ACADEMICPLAN}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${EXPLORER_PARAM.CAREERGOAL}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${EXPLORER_PARAM.COURSE}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.DEGREES}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.DEGREES}/${EXPLORER_PARAM.DEGREE}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {

      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${EXPLORER_PARAM.INTEREST}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${EXPLORER_PARAM.OPPORTUNITY}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.USERS}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    /* ############################## Page Tracking SCOREBOARD ############################## */
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.CAREERGOAL}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.COURSE}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.INTEREST}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.OPPORTUNITY}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    /* ############################## Page Tracking Comparison ############################## */
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.CAREERGOAL}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.COURSE}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.INTEREST}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
    {
      path: `/${URL_ROLES.MENTOR}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.OPPORTUNITY}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
  ],
  STUDENT: [
    /* ############################## HOME ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${HOME}`,
      exact: true,
      component: StudentHomePageContainer,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${HOME}/aboutme`,
      exact: true,
      component: StudentHomeAboutMePageContainer,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${HOME}/ice`,
      exact: true,
      component: StudentHomeIcePageContainer,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${HOME}/levels`,
      exact: true,
      component: StudentHomeLevelsPageContainer,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${HOME}/log`,
      exact: true,
      component: StudentHomeLogPageContainer,
    },
    /* ############################## DEGREE PLANNER ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/degree-planner`,
      exact: true,
      component: StudentDegreePlannerPage,
    },
    /* ############################## MENTOR SPACE ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${MENTOR_SPACE}`,
      exact: true,
      component: StudentMentorSpacePageContainer,
    },
    /* ############################## Page Tracking SCOREBOARD ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.CAREERGOAL}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.COURSE}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.INTEREST}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${PAGE_TRACKING_SCOREBOARD}/${PageInterestsCategoryTypes.OPPORTUNITY}`,
      exact: true,
      component: PageTrackingScoreboardPage,
    },
    /* ############################## Page Tracking Comparison ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.CAREERGOAL}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.COURSE}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.INTEREST}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${PAGE_TRACKING_COMPARISON}/${PageInterestsCategoryTypes.OPPORTUNITY}`,
      exact: true,
      component: PageTrackingComparisonPage,
    },
    /* ############################## Explorers ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}`,
      exact: true,
      component: ExplorerHomePageContainer,
    },
    /* ############################## Explorers ACADEMIC PLANS ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}/${EXPLORER_PARAM.ACADEMICPLAN}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    /* ############################## Explorers CAREER GOALS ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${EXPLORER_PARAM.CAREERGOAL}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    /* ############################## Explorers COURSES ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${EXPLORER_PARAM.COURSE}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    /* ############################## Explorers DEGREES ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.DEGREES}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.DEGREES}/${EXPLORER_PARAM.DEGREE}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    /* ############################## Explorers INTERESTS ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${EXPLORER_PARAM.INTEREST}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    /* ############################## Explorers OPPORTUNITIES ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${EXPLORER_PARAM.OPPORTUNITY}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    /* ############################## Explorers USERS ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.USERS}`,
      exact: true,
      component: CardExplorerPageContainer,
    },
  ],
};
