import { landingNavBar } from './navbar.landing.component';
import { facultyNavBar } from './navbar.faculty.component';
import { signinPage } from './signin.page';
import { facultyHomePage, facultyManageOpportunitiesPage, facultyVerificationPage} from './simple.page';

/* global fixture:false, test:false */

/** Credentials for sample user(s) defined in settings.development.json. */
const credentials = {
  faculty: { userName: 'johnson@hawaii.edu', password: 'foo' },
};

fixture('Faculty UI acceptance tests').page('http://localhost:3200');

test('Test faculty login', async (testController) => {
  await landingNavBar.gotoAdminLogin(testController);
  await signinPage.isDisplayed(testController);
  await signinPage.signin(testController, credentials.faculty);
  await facultyNavBar.isLoggedIn(testController, credentials.faculty);
});

test('Test faculty top-level pages', async (testController) => {
  await landingNavBar.gotoStudentLogin(testController);
  await signinPage.signin(testController, credentials.faculty);

  await facultyNavBar.gotoHomePage(testController);
  await facultyHomePage.isDisplayed(testController);

  await facultyNavBar.gotoVerificationPage(testController);
  await facultyVerificationPage.isDisplayed(testController);

  await facultyNavBar.gotoManageOpportunitiesPage(testController);
  await facultyManageOpportunitiesPage.isDisplayed(testController);
});
