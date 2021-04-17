import AdminHomePage from '../../pages/admin/AdminHomePage';
import AdminAnalyticsLoggedInUsersPage from '../../pages/admin/AdminAnalyticsLoggedInUsersPage';
import AdminAnalyticsNewsletterPage from '../../pages/admin/AdminAnalyticsNewsletterPage';
import AdminAnalyticsOverheadAnalysisPage from '../../pages/admin/AdminAnalyticsOverheadAnalysisPage';
import AdminAnalyticsStudentSummaryPage from '../../pages/admin/AdminAnalyticsStudentSummaryPage';
import AdminAnalyticsUserInteractionsPage from '../../pages/admin/AdminAnalyticsUserInteractionsPage';
import AdminDatabaseDumpPage from '../../pages/admin/AdminDatabaseDumpPage';
import AdminDatabaseCheckIntegrityPage from '../../pages/admin/AdminDatabaseCheckIntegrityPage';
import AdminDataModelAcademicTermsPage from '../../pages/admin/AdminDataModelAcademicTermsPage';
import AdminDataModelAcademicYearsPage from '../../pages/admin/AdminDataModelAcademicYearsPage';
import AdminDataModelCareerGoalsPage from '../../pages/admin/AdminDataModelCareerGoalsPage';
import AdminDataModelUsersPage from '../../pages/admin/AdminDataModelUsersPage';
import AdminDataModelCourseInstancesPage from '../../pages/admin/AdminDataModelCourseInstancesPage';
import AdminDataModelCoursesPage from '../../pages/admin/AdminDataModelCoursesPage';
import AdminDataModelFeedsPage from '../../pages/admin/AdminDataModelFeedsPage';
import AdminDataModelInterestsPage from '../../pages/admin/AdminDataModelInterestsPage';
import AdminDataModelInterestTypesPage from '../../pages/admin/AdminDataModelInterestTypesPage';
import AdminDataModelOpportunitiesPage from '../../pages/admin/AdminDataModelOpportunitiesPage';
import AdminDataModelOpportunityInstancesPage from '../../pages/admin/AdminDataModelOpportunityInstancesPage';
import AdminDataModelOpportunityTypesPage from '../../pages/admin/AdminDataModelOpportunityTypesPage';
import AdminDataModelReviewsPage from '../../pages/admin/AdminDataModelReviewsPage';
import AdminDataModelSlugsPage from '../../pages/admin/AdminDataModelSlugsPage';
import AdminDataModelTeasersPage from '../../pages/admin/AdminDataModelTeasersPage';
import AdminDataModelVerificationRequestsPage from '../../pages/admin/AdminDataModelVerificationRequestsPage';
import AdminAdvisorFacultyPrivacyPage from '../../pages/shared/AdminAdvisorFacultyPrivacyPage';
import AdvisorHomePage from '../../pages/advisor/AdvisorHomePage';
import AdvisorManageStudentsPage from '../../pages/advisor/AdvisorManageStudentsPage';
import AlumniHomePage from '../../pages/alumni/AlumniHomePage';
import CareerGoalBrowserViewPage from '../../pages/shared/browser-view/CareerGoalBrowserViewPage';
import CareerGoalViewPage from '../../pages/shared/item-view/CareerGoalViewPage';
import CommunityPage from '../../pages/shared/CommunityPage';
import CourseBrowserViewPage from '../../pages/shared/browser-view/CourseBrowserViewPage';
import CourseViewPage from '../../pages/shared/item-view/CourseViewPage';
import FacultyHomePage from '../../pages/faculty/FacultyHomePage';
import FacultyVerificationPage from '../../pages/faculty/FacultyVerificationPage';
import ForecastPage from '../../pages/shared/ForecastPage';
import InterestBrowserViewPage from '../../pages/shared/browser-view/InterestBrowserViewPage';
import InterestViewPage from '../../pages/shared/item-view/InterestViewPage';
import LandingHomePage from '../../pages/landing/LandingHomePage';
import LandingCareerGoalsExplorerPage from '../../pages/landing/LandingCareerGoalsExplorerPage';
import LandingCareerGoalExplorerPage from '../../pages/landing/LandingCareerGoalExplorerPage';
import LandingCoursesExplorerPage from '../../pages/landing/LandingCoursesExplorerPage';
import LandingCourseExplorerPage from '../../pages/landing/LandingCourseExplorerPage';
import LandingInterestsExplorerPage from '../../pages/landing/LandingInterestsExplorerPage';
import LandingInterestExplorerPage from '../../pages/landing/LandingInterestExplorerPage';
import LandingOpportunitiesExplorerPage from '../../pages/landing/LandingOpportunitiesExplorerPage';
import LandingOpportunityExplorerPage from '../../pages/landing/LandingOpportunityExplorerPage';
import ManageOpportunitiesPage from '../../pages/shared/ManageOpportunitiesPage';
import ManageVerificationsPage from '../../pages/shared/ManageVerificationsPage';
import ManageReviewsPage from '../../pages/shared/ManageReviewsPage';
import OpportunityBrowserViewPage from '../../pages/shared/browser-view/OpportunityBrowserViewPage';
import OpportunityViewPage from '../../pages/shared/item-view/OpportunityViewPage';
import SandboxLabelPage from '../../pages/sandbox/SandboxLabelPage';
import SandBoxSegmentPage from '../../pages/sandbox/SandBoxSegmentPage';
import StudentDegreePlannerPage from '../../pages/student/StudentDegreePlannerPage';
import StudentHomePage from '../../pages/student/StudentHomePage';
import StudentIcePage from '../../pages/student/StudentIcePage';
import StudentLevelsPage from '../../pages/student/StudentLevelsPage';
import StudentPrivacyPage from '../../pages/student/StudentPrivacyPage';
import StudentReviewsPage from '../../pages/student/StudentReviewsPage';
import TermsAndConditionsPage from '../../pages/shared/TermsAndConditionsPage';
import StudentVerificationPage from '../../pages/student/StudentVerificationPage';

import {
  ANALYTICS,
  COMMUNITY,
  DATABASE,
  DATAMODEL,
  DEGREEPLANNER,
  EXPLORER,
  FORECASTS,
  HOME,
  ICE,
  LEVELS,
  MANAGE,
  PRIVACY,
  STUDENT_REVIEWS,
  STUDENT_VERIFICATION,
  TERMS_AND_CONDITIONS,
  URL_ROLES,
  USERNAME,
  VERIFICATION_REQUESTS,
} from './route-constants';

/**
 * Here are the routes for RadGrad2. The keys are the Roles, the values are an array of route information.
 * Route information consists of a path, the path to the component, a Component to render.
 */

export const routes = {
  ADMIN: [
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${ANALYTICS.NEWSLETTER}`, component: AdminAnalyticsNewsletterPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${ANALYTICS.OVERHEAD_ANALYSIS}`, component: AdminAnalyticsOverheadAnalysisPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${ANALYTICS.STUDENT_SUMMARY}`, component: AdminAnalyticsStudentSummaryPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${ANALYTICS.USER_INTERACTIONS}`, component: AdminAnalyticsUserInteractionsPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${ANALYTICS.LOGGED_IN_USERS}`, component: AdminAnalyticsLoggedInUsersPage },

    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${COMMUNITY}`, component: CommunityPage },

    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATABASE.DUMP}`, component: AdminDatabaseDumpPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATABASE.CHECK_INTEGRITY}`, component: AdminDatabaseCheckIntegrityPage },

    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL.ACADEMIC_TERMS}`, component: AdminDataModelAcademicTermsPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL.ACADEMIC_YEAR_INSTANCES}`, component: AdminDataModelAcademicYearsPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL.CAREERGOALS}`, component: AdminDataModelCareerGoalsPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL.COURSE_INSTANCES}`, component: AdminDataModelCourseInstancesPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL.COURSES}`, component: AdminDataModelCoursesPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL.FEEDS}`, component: AdminDataModelFeedsPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL.INTERESTS}`, component: AdminDataModelInterestsPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL.INTEREST_TYPES}`, component: AdminDataModelInterestTypesPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL.OPPORTUNITIES}`, component: AdminDataModelOpportunitiesPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL.OPPORTUNITY_INSTANCES}`, component: AdminDataModelOpportunityInstancesPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL.OPPORTUNITY_TYPES}`, component: AdminDataModelOpportunityTypesPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL.REVIEWS}`, component: AdminDataModelReviewsPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL.SLUGS}`, component: AdminDataModelSlugsPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL.TEASERS}`, component: AdminDataModelTeasersPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL.USERS}`, component: AdminDataModelUsersPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${DATAMODEL.VERIFICATION_REQUESTS}`, component: AdminDataModelVerificationRequestsPage },

    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${EXPLORER.CAREERGOALS}`, component: CareerGoalBrowserViewPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${EXPLORER.CAREERGOALS_PARAM}`, component: CareerGoalViewPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${EXPLORER.COURSES}`, component: CourseBrowserViewPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${EXPLORER.COURSES_PARAM}`, component: CourseViewPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${EXPLORER.INTERESTS}`, component: InterestBrowserViewPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${EXPLORER.INTERESTS_PARAM}`, component: InterestViewPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${EXPLORER.OPPORTUNITIES}`, component: OpportunityBrowserViewPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${EXPLORER.OPPORTUNITIES_PARAM}`, component: OpportunityViewPage },

    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${FORECASTS}`, component: ForecastPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${HOME}`, component: AdminHomePage },

    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${MANAGE.REVIEWS}`, component: ManageReviewsPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${MANAGE.STUDENTS}`, component: AdvisorManageStudentsPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${MANAGE.REVIEWS}`, component: ManageReviewsPage },
    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${MANAGE.VERIFICATIONS}`, component: ManageVerificationsPage  },

    { path: `/${URL_ROLES.ADMIN}/${USERNAME}/${PRIVACY}`, component: AdminAdvisorFacultyPrivacyPage },
  ],

  ADVISOR: [
    { path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${COMMUNITY}`, component: CommunityPage },
    { path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${EXPLORER.CAREERGOALS}`, component: CareerGoalBrowserViewPage },
    { path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${EXPLORER.CAREERGOALS_PARAM}`, component: CareerGoalViewPage },
    { path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${EXPLORER.COURSES}`, component: CourseBrowserViewPage },
    { path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${EXPLORER.COURSES_PARAM}`, component: CourseViewPage },
    { path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${EXPLORER.INTERESTS}`, component: InterestBrowserViewPage },
    { path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${EXPLORER.INTERESTS_PARAM}`, component: InterestViewPage },
    { path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${EXPLORER.OPPORTUNITIES}`, component: OpportunityBrowserViewPage },
    { path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${EXPLORER.OPPORTUNITIES_PARAM}`, component: OpportunityViewPage },
    { path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${FORECASTS}`, component: ForecastPage },
    { path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${HOME}`, component: AdvisorHomePage },
    { path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${MANAGE.OPPORTUNITIES}`, component: ManageOpportunitiesPage },
    { path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${MANAGE.STUDENTS}`, component: AdvisorManageStudentsPage },
    { path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${MANAGE.REVIEWS}`, component: ManageReviewsPage },
    { path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${MANAGE.VERIFICATIONS}`, component: ManageVerificationsPage  },
    { path: `/${URL_ROLES.ADVISOR}/${USERNAME}/${PRIVACY}`, component: AdminAdvisorFacultyPrivacyPage },
  ],

  ALUMNI: [
    { path: `/${URL_ROLES.ALUMNI}/${USERNAME}/${HOME}`, component: AlumniHomePage },
  ],

  FACULTY: [
    { path: `/${URL_ROLES.FACULTY}/${USERNAME}/${COMMUNITY}`, component: CommunityPage },
    { path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER.CAREERGOALS}`, component: CareerGoalBrowserViewPage },
    { path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER.CAREERGOALS_PARAM}`, component: CareerGoalViewPage },
    { path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER.COURSES}`, component: CourseBrowserViewPage },
    { path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER.COURSES_PARAM}`, component: CourseViewPage },
    { path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER.INTERESTS}`, component: InterestBrowserViewPage },
    { path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER.INTERESTS_PARAM}`, component: InterestViewPage },
    { path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER.OPPORTUNITIES}`, component: OpportunityBrowserViewPage },
    { path: `/${URL_ROLES.FACULTY}/${USERNAME}/${EXPLORER.OPPORTUNITIES_PARAM}`, component: OpportunityViewPage },
    { path: `/${URL_ROLES.FACULTY}/${USERNAME}/${FORECASTS}`, component: ForecastPage },
    { path: `/${URL_ROLES.FACULTY}/${USERNAME}/${HOME}`, component: FacultyHomePage },
    { path: `/${URL_ROLES.FACULTY}/${USERNAME}/${MANAGE.OPPORTUNITIES}`, component: ManageOpportunitiesPage },
    { path: `/${URL_ROLES.FACULTY}/${USERNAME}/${MANAGE.REVIEWS}`, component: ManageReviewsPage },
    { path: `/${URL_ROLES.FACULTY}/${USERNAME}/${MANAGE.VERIFICATIONS}`, component: ManageVerificationsPage },
    { path: `/${URL_ROLES.FACULTY}/${USERNAME}/${PRIVACY}`, component: AdminAdvisorFacultyPrivacyPage },
    { path: `/${URL_ROLES.FACULTY}/${USERNAME}/${VERIFICATION_REQUESTS}`, component: FacultyVerificationPage },
  ],

  LANDING: [
    { path: '/', component: LandingHomePage },
    { path: `/${EXPLORER.CAREERGOALS}`, component: LandingCareerGoalsExplorerPage },
    { path: `/${EXPLORER.CAREERGOALS_PARAM}`, component: LandingCareerGoalExplorerPage },
    { path: `/${EXPLORER.COURSES}`, component: LandingCoursesExplorerPage },
    { path: `/${EXPLORER.COURSES_PARAM}`, component: LandingCourseExplorerPage, exact: false },
    { path: `/${EXPLORER.INTERESTS}`, component: LandingInterestsExplorerPage },
    { path: `/${EXPLORER.INTERESTS_PARAM}`, component: LandingInterestExplorerPage, exact: false },
    { path: `/${EXPLORER.OPPORTUNITIES}`, component: LandingOpportunitiesExplorerPage },
    { path: `/${EXPLORER.OPPORTUNITIES_PARAM}`, component: LandingOpportunityExplorerPage, exact: false },
  ],

  STUDENT: [
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/${COMMUNITY}`, component: CommunityPage },
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/${DEGREEPLANNER}`, component: StudentDegreePlannerPage },
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER.CAREERGOALS}`, component: CareerGoalBrowserViewPage },
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER.CAREERGOALS_PARAM}`, component: CareerGoalViewPage },
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER.COURSES}`, component: CourseBrowserViewPage },
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER.COURSES_PARAM}`, component: CourseViewPage },
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER.INTERESTS}`, component: InterestBrowserViewPage },
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER.INTERESTS_PARAM}`, component: InterestViewPage },
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER.OPPORTUNITIES}`, component: OpportunityBrowserViewPage },
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/${EXPLORER.OPPORTUNITIES_PARAM}`, component: OpportunityViewPage },
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/${HOME}`, component: StudentHomePage },
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/${ICE}`, component: StudentIcePage },
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/${LEVELS}`, component: StudentLevelsPage },
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/${PRIVACY}`, component: StudentPrivacyPage },
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/${STUDENT_REVIEWS}`, component: StudentReviewsPage },
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/${STUDENT_VERIFICATION}`, component: StudentVerificationPage },
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/${TERMS_AND_CONDITIONS}`, component: TermsAndConditionsPage },
    // The following routes display sandbox pages under the student role.
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/sandbox/labels`, component: SandboxLabelPage },
    { path: `/${URL_ROLES.STUDENT}/${USERNAME}/sandbox/segments`, component: SandBoxSegmentPage },
  ],
};
