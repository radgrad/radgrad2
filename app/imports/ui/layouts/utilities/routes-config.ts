/**
 * This object holds all the routes for RadGrad2. The keys are the Roles the values are an array of route information.
 * Route information consists of a path, the path to the component, a Component to render.
 */
import AdminHomePage from '../../pages/admin/AdminHomePage';
import AdminDataModelPage from '../../pages/admin/AdminDataModelPage';
import AdminDatabasePage from '../../pages/admin/AdminDatabasePage';
import AdminModerationPage from '../../pages/admin/AdminModerationPage';
import AdminAnalyticsPage from '../../pages/admin/AdminAnalyticsPage';
import AdminAnalyticsNewsletterPage from '../../pages/admin/AdminAnalyticsNewsletterPage';
import AdminAnalyticsOverheadAnalysisPage from '../../pages/admin/AdminAnalyticsOverheadAnalysisPage';
import AdminAnalyticsStudentSummaryPage from '../../pages/admin/AdminAnalyticsStudentSummaryPage';
import AdminAnalyticsUserInteractionsPage from '../../pages/admin/AdminAnalyticsUserInteractionsPage';
import LandingHomePage from '../../pages/landing/LandingHomePage';
import AdminDumpDatabasePage from '../../pages/admin/AdminDumpDatabasePage';
import AdminCheckDatabaseIntegrityPage from '../../pages/admin/AdminCheckDatabaseIntegrityPage';
import AdminDataModelAcademicTermsPage from '../../pages/admin/AdminDataModelAcademicTermsPage';
import AdminDataModelAcademicYearsPage from '../../pages/admin/AdminDataModelAcademicYearsPage';
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
import AdminDataModelReviewsPage from '../../pages/admin/AdminDataModelReviewsPage';
import AdminDataModelSlugsPage from '../../pages/admin/AdminDataModelSlugsPage';
import AdminDataModelTeasersPage from '../../pages/admin/AdminDataModelTeasersPage';
import AdminDataModelVerificationRequestsPage from '../../pages/admin/AdminDataModelVerificationRequestsPage';
import AdvisorHomePage from '../../pages/advisor/AdvisorHomePage';
import AdvisorAboutMePage from '../../pages/advisor/AdvisorAboutMePage';
import AdvisorManageStudentsPage from '../../pages/advisor/AdvisorManageStudentsPage';
import AdvisorModerationPage from '../../pages/advisor/AdvisorModerationPage';
import AlumniHomePage from '../../pages/alumni/AlumniHomePage';
import CareerGoalBrowserViewPage from '../../pages/shared/browser-view/CareerGoalBrowserViewPage';
import CommunityPage from '../../pages/shared/CommunityPage';
import CourseBrowserViewPage from '../../pages/shared/browser-view/CourseBrowserViewPage';
import CareerGoalViewPage from '../../pages/shared/item-view/CareerGoalViewPage';
import CourseViewPage from '../../pages/shared/item-view/CourseViewPage';
import ExplorerHomePagePage from '../../pages/shared/ExplorerHomePage';
import ExplorerOpportunitiesPage from '../../pages/shared/ExplorerOpportunitiesPage';
import FacultyPrivacyPage from '../../pages/faculty/FacultyPrivacyPage';
import FacultyVerificationPage from '../../pages/faculty/FacultyVerificationPage';
import FacultyHomePage from '../../pages/faculty/FacultyHomePage';
import FacultyManageOpportunitiesPage from '../../pages/faculty/FacultyManageOpportunitiesPage';
import InterestBrowserViewPage from '../../pages/shared/browser-view/InterestBrowserViewPage';
import InterestViewPage from '../../pages/shared/item-view/InterestViewPage';
import LandingCareerGoalsExplorerPage from '../../pages/landing/LandingCareerGoalsCardExplorerPage';
import LandingCareerGoalExplorerPage from '../../pages/landing/LandingCareerGoalExplorerPage';
import LandingCoursesExplorerPage from '../../pages/landing/LandingCoursesCardExplorerPage';
import LandingCourseExplorerPage from '../../pages/landing/LandingCourseExplorerPage';
import LandingInterestsExplorerPage from '../../pages/landing/LandingInterestsCardExplorerPage';
import LandingInterestExplorerPage from '../../pages/landing/LandingInterestExplorerPage';
import LandingOpportunitiesExplorerPage from '../../pages/landing/LandingOpportunitiesCardExplorerPage';
import LandingOpportunityExplorerPage from '../../pages/landing/LandingOpportunityExplorerPage';
import ManageVerificationsPage from '../../pages/shared/ManageVerificationsPage';
import OpportunityViewPage from '../../pages/shared/item-view/OpportunityViewPage';
import PageTrackingScoreboardPage from '../../pages/shared/PageTrackingScoreboardPage';
import PageTrackingComparisonPage from '../../pages/shared/PageTrackingComparisonPage';
import { PageInterestsCategoryTypes } from '../../../api/page-tracking/PageInterestsCategoryTypes';
import ReviewModerationPage from '../../pages/shared/ReviewModerationPage';
import ScoreboardPage from '../../pages/shared/ScoreboardPage';
import StudentHomePage from '../../pages/student/StudentHomePage';
import StudentDegreePlannerPage from '../../pages/student/StudentDegreePlannerPage';
import StudentAboutMePage from '../../pages/student/StudentAboutMePage';
import StudentIcePage from '../../pages/student/StudentIcePage';
import StudentLevelsPage from '../../pages/student/StudentLevelsPage';
import StudentPrivacyPage from '../../pages/student/StudentPrivacyPage';
import StudentReviewsPage from '../../pages/student/StudentReviewsPage';
import StudentVerificationPage from '../../pages/student/StudentVerificationPage';

import {
  ANALYTICS,
  COMMUNITY,
  COURSE_SCOREBOARD,
  DATAMODEL,
  DEGREEPLANNER,
  EXPLORER_PARAM,
  EXPLORER_TYPE,
  HOME,
  ICE,
  LEVELS,
  MANAGE_STUDENTS,
  MANAGE_VERIFICATIONS,
  MODERATION,
  OPPORTUNITY_SCOREBOARD,
  PAGE_TRACKING_SCOREBOARD,
  PAGE_TRACKING_COMPARISON,
  PRIVACY,
  MANAGE_REVIEWS,
  SCOREBOARD,
  STUDENT_REVIEWS,
  STUDENT_VERIFICATION,
  URL_ROLES,
  USERNAME,
} from './route-constants';




export const routes = {
  ADMIN: [
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${HOME}`,
      exact: true,
      component: AdminHomePage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}`,
      exact: true,
      component: AdminDataModelPage,
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
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL}/users`,
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
      component: AdminDatabasePage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/database/dump`,
      exact: true,
      component: AdminDumpDatabasePage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/database/integrity-check`,
      exact: true,
      component: AdminCheckDatabaseIntegrityPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${MODERATION}`,
      exact: true,
      component: AdminModerationPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${ANALYTICS.HOME}`,
      exact: true,
      component: AdminAnalyticsPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${ANALYTICS.HOME}/${ANALYTICS.NEWSLETTER}`,
      exact: true,
      component: AdminAnalyticsNewsletterPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${ANALYTICS.HOME}/${ANALYTICS.OVERHEADANALYSIS}`,
      exact: true,
      component: AdminAnalyticsOverheadAnalysisPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${ANALYTICS.HOME}/${ANALYTICS.STUDENTSUMMARY}`,
      exact: true,
      component: AdminAnalyticsStudentSummaryPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${ANALYTICS.HOME}/${ANALYTICS.USERINTERACTIONS}`,
      exact: true,
      component: AdminAnalyticsUserInteractionsPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${SCOREBOARD}`,
      exact: true,
      component: ScoreboardPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${SCOREBOARD}/${COURSE_SCOREBOARD}`,
      exact: true,
      component: ScoreboardPage,
    },
    {
      path: `/${URL_ROLES.ADMIN}/${USERNAME}/${SCOREBOARD}/${OPPORTUNITY_SCOREBOARD}`,
      exact: true,
      component: ScoreboardPage,
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
      component: AdvisorHomePage,
      exact: true,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${MANAGE_VERIFICATIONS}`,
      component: ManageVerificationsPage,
      exact: true,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${HOME}/aboutme`,
      component: AdvisorAboutMePage,
      exact: true,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${MODERATION}`,
      exact: true,
      component: AdvisorModerationPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${SCOREBOARD}`,
      exact: true,
      component: ScoreboardPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${SCOREBOARD}/${COURSE_SCOREBOARD}`,
      exact: true,
      component: ScoreboardPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${SCOREBOARD}/${OPPORTUNITY_SCOREBOARD}`,
      exact: true,
      component: ScoreboardPage,
    },
    /* ############################## Explorers ############################## */
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${EXPLORER_TYPE.HOME}`,
      exact: true,
      component: ExplorerHomePagePage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}`,
      exact: true,
      component: CareerGoalBrowserViewPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${EXPLORER_PARAM.CAREERGOAL}`,
      exact: true,
      component: CareerGoalViewPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}`,
      exact: true,
      component: CourseBrowserViewPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${EXPLORER_PARAM.COURSE}`,
      exact: true,
      component: CourseViewPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}`,
      exact: true,
      component: InterestBrowserViewPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${EXPLORER_PARAM.INTEREST}`,
      exact: true,
      component: InterestViewPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}`,
      exact: true,
      component: ExplorerOpportunitiesPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${EXPLORER_PARAM.OPPORTUNITY}`,
      exact: true,
      component: OpportunityViewPage,
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
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${COMMUNITY}`,
      exact: true,
      component: CommunityPage,
    },
    {
      path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${MANAGE_STUDENTS}`,
      exact: true,
      component: AdvisorManageStudentsPage,
    },
  ],
  ALUMNI: [
    {
      path: `/${URL_ROLES.ALUMNI}/${USERNAME}/${HOME}`,
      component: AlumniHomePage,
    },
  ],
  FACULTY: [
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${HOME}`,
      component: FacultyHomePage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/verification-requests`,
      exact: true,
      component: FacultyVerificationPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/manage-opportunities`,
      exact: true,
      component: FacultyManageOpportunitiesPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}`,
      exact: true,
      component: ExplorerHomePagePage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}`,
      exact: true,
      component: CareerGoalBrowserViewPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${EXPLORER_PARAM.CAREERGOAL}`,
      exact: true,
      component: CareerGoalViewPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}`,
      exact: true,
      component: CourseBrowserViewPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${EXPLORER_PARAM.COURSE}`,
      exact: true,
      component: CourseViewPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}`,
      exact: true,
      component: InterestBrowserViewPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${EXPLORER_PARAM.INTEREST}`,
      exact: true,
      component: InterestViewPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}`,
      exact: true,
      component: ExplorerOpportunitiesPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${EXPLORER_PARAM.OPPORTUNITY}`,
      exact: true,
      component: OpportunityViewPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${SCOREBOARD}`,
      exact: true,
      component: ScoreboardPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${SCOREBOARD}/${COURSE_SCOREBOARD}`,
      exact: true,
      component: ScoreboardPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${SCOREBOARD}/${OPPORTUNITY_SCOREBOARD}`,
      exact: true,
      component: ScoreboardPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${PRIVACY}`,
      exact: true,
      component: FacultyPrivacyPage,
    },
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${MANAGE_REVIEWS}`,
      exact: true,
      component: ReviewModerationPage,
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
    {
      path: `/${URL_ROLES.FACULTY}/${USERNAME}/${COMMUNITY}`,
      exact: true,
      component: CommunityPage,
    },
  ],
  LANDING: [
    {
      path: '/',
      exact: true,
      component: LandingHomePage,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}`,
      exact: true,
      component: LandingCareerGoalsExplorerPage,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${EXPLORER_PARAM.CAREERGOAL}`,
      exact: false,
      component: LandingCareerGoalExplorerPage,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}`,
      exact: true,
      component: LandingCoursesExplorerPage,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${EXPLORER_PARAM.COURSE}`,
      exact: false,
      component: LandingCourseExplorerPage,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}`,
      exact: true,
      component: LandingInterestsExplorerPage,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${EXPLORER_PARAM.INTEREST}`,
      exact: false,
      component: LandingInterestExplorerPage,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}`,
      exact: true,
      component: LandingOpportunitiesExplorerPage,
    },
    {
      path: `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${EXPLORER_PARAM.OPPORTUNITY}`,
      exact: false,
      component: LandingOpportunityExplorerPage,
    },
  ],
  STUDENT: [
    /* ############################## HOME ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${HOME}`,
      exact: true,
      component: StudentHomePage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${STUDENT_VERIFICATION}`,
      exact: true,
      component: StudentVerificationPage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${PRIVACY}`,
      exact: true,
      component: StudentPrivacyPage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${STUDENT_REVIEWS}`,
      exact: true,
      component: StudentReviewsPage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${COMMUNITY}`,
      exact: true,
      component: CommunityPage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${HOME}/aboutme`,
      exact: true,
      component: StudentAboutMePage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${HOME}/${ICE}`,
      exact: true,
      component: StudentIcePage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${HOME}/${LEVELS}`,
      exact: true,
      component: StudentLevelsPage,
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
      component: ExplorerHomePagePage,
    },
    /* ############################## Explorers CAREER GOALS ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}`,
      exact: true,
      component: CareerGoalBrowserViewPage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${EXPLORER_PARAM.CAREERGOAL}`,
      exact: true,
      component: CareerGoalViewPage,
    },
    /* ############################## Explorers COURSES ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}`,
      exact: true,
      component: CourseBrowserViewPage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${EXPLORER_PARAM.COURSE}`,
      exact: true,
      component: CourseViewPage,
    },
    /* ############################## Explorers INTERESTS ############################## */
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}`,
      exact: true,
      component: InterestBrowserViewPage,
    },
    {
      path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${EXPLORER_PARAM.INTEREST}`,
      exact: true,
      component: InterestViewPage,
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
      component: OpportunityViewPage,
    },
  ],
};
