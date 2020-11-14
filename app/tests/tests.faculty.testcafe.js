import { landingNavBar } from './landing.navbar.component';
import { facultyNavBar } from './faculty.navbar.component';
import { signinPage } from './signin.page';
import { landingPage } from './simple.page';

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
});
