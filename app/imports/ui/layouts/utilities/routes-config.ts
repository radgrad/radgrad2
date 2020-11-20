/**
 * This object holds all the routes for RadGrad2. The keys are the Roles the values are an array of route information.
 * Route information consists of a path, the path to the component, a Component to render.
 */
import LandingHomePage from '../../pages/landing/LandingHomePage';
import LandingGuidedTourAdvisorPage from '../../pages/landing/LandingGuidedTourAdvisorPage';
import LandingGuidedTourFacultyPage from '../../pages/landing/LandingGuidedTourFacultyPage';
import GuidedTourStudentContainer from '../../pages/landing/LandingGuidedTourStudentPage';
import LandingCareerGoalsCardExplorerContainer from '../../pages/landing/LandingCareerGoalsCardExplorerPage';
import LandingCareerGoalExplorerContainer from '../../pages/landing/LandingCareerGoalExplorerPage';
import LandingCoursesCardExplorerContainer from '../../pages/landing/LandingCoursesCardExplorerPage';
import LandingCourseExplorerContainer from '../../pages/landing/LandingCourseExplorerPage';
import LandingInterestsCardExplorerContainer from '../../pages/landing/LandingInterestsCardExplorerPage';
import LandingInterestExplorerContainer from '../../pages/landing/LandingInterestExplorerPage';
import LandingOpportunitiesCardExplorerContainer from '../../pages/landing/LandingOpportunitiesCardExplorerPage';
import LandingOpportunityExplorerContainer from '../../pages/landing/LandingOpportunityExplorerPage';
import LandingAcademicPlansCardExplorerContainer from '../../pages/landing/LandingAcademicPlansCardExplorerPage';
import LandingAcademicPlanExplorerContainer from '../../pages/landing/LandingAcademicPlanExplorerPage';
import ExplorerHomePageContainer from '../../pages/shared/ExplorerHomePage';
import CardExplorerPageContainer from '../../pages/shared/ExplorerMultipleItemsPage';
import IndividualExplorerPageContainer from '../../pages/shared/ExplorerSingleItemPage';
import AdminHomePageContainer from '../../pages/admin/AdminHomePage';
import AdminDataModelPageContainer from '../../pages/admin/AdminDataModelPage';
import AdminDatabasePageContainer from '../../pages/admin/AdminDatabasePage';
import AdminModerationPageContainer from '../../pages/admin/AdminModerationPage';
import AdminAnalyticsPageContainer from '../../pages/admin/AdminAnalyticsPage';
import AdminAnalyticsNewsletterPageContainer from '../../pages/admin/AdminAnalyticsNewsletterPage';
import AdminAnalyticsOverheadAnalysisPageContainer from '../../pages/admin/AdminAnalyticsOverheadAnalysisPage';
import AdminAnalyticsStudentSummaryPageContainer from '../../pages/admin/AdminAnalyticsStudentSummaryPage';
import AdminAnalyticsUserInteractionsPageContainer from '../../pages/admin/AdminAnalyticsUserInteractionsPage';
import AdvisorHomePageContainer from '../../pages/advisor/AdvisorHomePage';
import AdvisorVerificationRequestPageContainer from '../../pages/advisor/AdvisorVerificationRequestPage';
import AdvisorModerationPageContainer from '../../pages/advisor/AdvisorModerationPage';
import AdvisorAcademicPlanPageContainer from '../../pages/advisor/AdvisorAcademicPlanPage';
import FacultyVerificationPageContainer from '../../pages/faculty/FacultyVerificationPage';
import FacultyHomePageContainer from '../../pages/faculty/FacultyHomePage';
import FacultyManageOpportunitiesPageContainer from '../../pages/faculty/FacultyManageOpportunitiesPage';
import StudentHomePageContainer from '../../pages/student/StudentHomePage';
import StudentDegreePlannerPage from '../../pages/student/StudentDegreePlannerPage';
import StudentAboutMePage from '../../pages/student/StudentAboutMePage';
import StudentIcePage from '../../pages/student/StudentIcePage';
import StudentHomeLevelsPageContainer from '../../pages/student/StudentHomeLevelsPage';
import StudentHomeLogPageContainer from '../../pages/student/StudentHomeLogPage';
import AlumniHomePageContainer from '../../pages/alumni/AlumniHomePage';
import AdminDumpDatabasePageContainer from '../../pages/admin/AdminDumpDatabasePage';
import AdminCheckDatabaseIntegrityPageContainer from '../../pages/admin/AdminCheckDatabaseIntegrityPage';
import AdminDataModelAcademicPlansPage from '../../pages/admin/AdminDataModelAcademicPlansPage';
import AdminDataModelAcademicTermsPage from '../../pages/admin/AdminDataModelAcademicTermsPage';
import AdminDataModelAcademicYearsPage from '../../pages/admin/AdminDataModelAcademicYearsPage';
import AdminDataModelAdvisorLogsPage from '../../pages/admin/AdminDataModelAdvisorLogsPage';
import AdminDataModelCareerGoalsPage from '../../pages/admin/AdminDataModelCareerGoalsPage';
import AdminDataModelUsersPage from '../../pages/admin/AdminDataModelUsersPage';
import AdminDataModelCourseInstancesPage from '../../pages/admin/AdminDataModelCourseInstancesPage';
import AdminDataModelCoursesPage from '../../pages/admin/AdminDataModelCoursesPage';
import AdminDataModelFeedsPage from '../../pages/admin/AdminDataModelFeedsPage';
import AdminDataModelFeedbackInstancesPage from '../../pages/admin/AdminDataModelFeedbackInstancesPage';
import AdminDataModelHelpMessagesPage from '../../pages/admin/AdminDataModelHelpMessagesPage';
import AdminDataModelInterestsPage from '../../pages/admin/AdminDataModelInterestsPage';
import AdminDataModelInterestTypesPage from '../../pages/admin/AdminDataModelInterestTypesPage';
import AdminDataModelOpportunitiesPage from '../../pages/admin/AdminDataModelOpportunitiesPage';
import AdminDataModelOpportunityInstancesPage from '../../pages/admin/AdminDataModelOpportunityInstancesPage';
import AdminDataModelOpportunityTypesPage from '../../pages/admin/AdminDataModelOpportunityTypesPage';
import AdminDataModelPlanChoicesPage from '../../pages/admin/AdminDataModelPlanChoicesPage';
import AdminDataModelReviewsPage from '../../pages/admin/AdminDataModelReviewsPage';
import AdminDataModelSlugsPage from '../../pages/admin/AdminDataModelSlugsPage';
import AdminDataModelTeasersPage from '../../pages/admin/AdminDataModelTeasersPage';
import AdminDataModelVerificationRequestsPage from '../../pages/admin/AdminDataModelVerificationRequestsPage';
import ScoreboardPageContainer from '../../pages/shared/ScoreboardPage';
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
  PAGE_TRACKING_SCOREBOARD, PAGE_TRACKING_COMPARISON, DEGREEPLANNER, COMMUNITY,
} from './route-constants';
import PageTrackingScoreboardPage from '../../pages/shared/PageTrackingScoreboardPage';
import PageTrackingComparisonPage from '../../pages/shared/PageTrackingComparisonPage';
import { PageInterestsCategoryTypes } from '../../../api/page-tracking/PageInterestsCategoryTypes';
import ExplorerOpportunitiesPage from '../../pages/shared/ExplorerOpportunitiesPage';
import CommunityRadGradVideosPage from '../../pages/shared/CommunityRadGradVideosPage';
import CommunityUsersPage from '../../pages/shared/CommunityUsersPage';

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
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/${COMMUNITY.USERS}`,
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
      exact: true,
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
    /* ############################## Community ############################## */
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${COMMUNITY.HOME}/${COMMUNITY.RADGRADVIDEOS}`,
      exact: true,
      component: CommunityRadGradVideosPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${COMMUNITY.HOME}/${COMMUNITY.USERS}`,
      exact: true,
      component: CommunityUsersPage,
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
      component: ExplorerOpportunitiesPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${EXPLORER_PARAM.OPPORTUNITY}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${COMMUNITY.HOME}/${COMMUNITY.USERS}`,
      exact: true,
      component: CommunityUsersPage,
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
    /* ############################## Community ############################## */
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${COMMUNITY.HOME}/${COMMUNITY.RADGRADVIDEOS}`,
      exact: true,
      component: CommunityRadGradVideosPage,
    },
  ],
  LANDING: [
    {
      path: '/',
      exact: true,
      component: LandingHomePage,
    },
    {
      path: `/${GUIDEDTOUR}/${URL_ROLES.STUDENT}`,
      exact: true,
      component: GuidedTourStudentContainer,
    },
    {
      path: `/${GUIDEDTOUR}/${URL_ROLES.ADVISOR}`,
      exact: true,
      component: LandingGuidedTourAdvisorPage,
    },
    {
      path: `/${GUIDEDTOUR}/${URL_ROLES.FACULTY}`,
      exact: true,
      component: LandingGuidedTourFacultyPage,
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
      component: StudentAboutMePage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${HOME}/ice`,
      exact: true,
      component: StudentIcePage,
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
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${DEGREEPLANNER}`,
      exact: true,
      component: StudentDegreePlannerPage,
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
      component: ExplorerOpportunitiesPage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${EXPLORER_PARAM.OPPORTUNITY}`,
      exact: true,
      component: IndividualExplorerPageContainer,
    },
    /* ############################## Community ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${COMMUNITY.HOME}/${COMMUNITY.USERS}`,
      exact: true,
      component: CommunityUsersPage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${COMMUNITY.HOME}/${COMMUNITY.RADGRADVIDEOS}`,
      exact: true,
      component: CommunityRadGradVideosPage,
    },
  ],
};