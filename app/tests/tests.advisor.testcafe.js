import { landingNavBar } from './navbar.landing.component';
import { advisorNavBar } from './navbar.advisor.component';
import { signinPage } from './signin.page';
import { advisorHomePage, advisorVerificationRequestsPage, advisorModerationPage,
  advisorAcademicPlanPage, advisorScoreboardPage } from './simple.page';

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

  await advisorNavBar.gotoVerificationRequestsPage(testController);
  await advisorVerificationRequestsPage.isDisplayed(testController);

  await advisorNavBar.gotoModerationPage(testController);
  await advisorModerationPage.isDisplayed(testController);

  await advisorNavBar.gotoAcademicPlanPage(testController);
  await advisorAcademicPlanPage.isDisplayed(testController);

  await advisorNavBar.gotoScoreboardPage(testController);
  await advisorScoreboardPage.isDisplayed(testController);
});
