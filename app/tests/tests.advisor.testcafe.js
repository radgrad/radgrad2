import { landingNavBar } from './navbar.landing.component';
import { advisorNavBar } from './navbar.advisor.component';
import { signinPage } from './signin.page';
import {
  advisorHomePage,
  advisorFacultyPrivacyPage,
  forecastsPage,
  communityPage,
  careerGoalExplorerPage,
  courseExplorerPage,
  interestExplorerPage,
  opportunityExplorerPage,
  manageStudentsPage,
  manageVerificationPage,
  manageReviewsPage,
  manageOpportunitiesPage,
} from './simple.page';

// eslint-disable-next-line @typescript-eslint/no-redeclare
/* global fixture:false, test:false */

/** Credentials for sample user(s) defined in settings.development.json. */
const credentials = {
  advisor: { userName: 'glau@hawaii.edu', password: 'foo' },
};

fixture('Advisor UI acceptance tests').page('http://localhost:3200');

test('Test advisor login', async (testController) => {
  await landingNavBar.gotoAdminLogin(testController);
  await signinPage.isDisplayed(testController);
  await signinPage.signin(testController, credentials.advisor);
  await advisorNavBar.isLoggedIn(testController, credentials.advisor);
});

test('Test advisor top-level pages', async (testController) => {
  await landingNavBar.gotoStudentLogin(testController);
  await signinPage.signin(testController, credentials.advisor);

  await advisorNavBar.gotoHomePage(testController);
  await advisorHomePage.isDisplayed(testController);

  await advisorNavBar.gotoPrivacyPage(testController);
  await advisorFacultyPrivacyPage.isDisplayed(testController);

  await advisorNavBar.gotoForecastsPage(testController);
  await forecastsPage.isDisplayed(testController);

  await advisorNavBar.gotoCommunityPage(testController);
  await communityPage.isDisplayed(testController);

  await advisorNavBar.gotoCareerGoalsExplorerPage(testController);
  await careerGoalExplorerPage.isDisplayed(testController);

  await advisorNavBar.gotoCoursesExplorerPage(testController);
  await courseExplorerPage.isDisplayed(testController);

  await advisorNavBar.gotoInterestsExplorerPage(testController);
  await interestExplorerPage.isDisplayed(testController);

  await advisorNavBar.gotoOpportunitiesExplorerPage(testController);
  await opportunityExplorerPage.isDisplayed(testController);

  await advisorNavBar.gotoManageStudentsPage(testController);
  await manageStudentsPage.isDisplayed(testController);

  await advisorNavBar.gotoManageVerificationPage(testController);
  await manageVerificationPage.isDisplayed(testController);

  await advisorNavBar.gotoManageReviewPage(testController);
  await manageReviewsPage.isDisplayed(testController);

  await advisorNavBar.gotoManageOpportunitiesPage(testController);
  await manageOpportunitiesPage.isDisplayed(testController);
});
