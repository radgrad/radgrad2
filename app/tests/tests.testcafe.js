import { LandingPage } from './landing.page';
import { AdminHomePage } from './admin.home.page';
import { AdminNavBar } from './admin.navbar.component';
import { SigninPage } from './signin.page';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = {
  admin: { username: 'radgrad@hawaii.edu', password: 'foo' },
};

const landingPage = new LandingPage();
const signinPage = new SigninPage();
const adminNavBar = new AdminNavBar(credentials.admin);
const adminHomePage = new AdminHomePage();

fixture('RadGrad localhost test with default db')
    .page('http://localhost:3200');

test.skip('Test that landing page shows up', async (testController) => {
  // Note: landingPage.isDisplayed waits 10 seconds to ensure app comes up; needed for CI mode.
  // You probably want to skip this test during development, but make sure it's enabled when committing to master.
  await landingPage.isDisplayed(testController);
});

test('Test admin login', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.isDisplayed(testController);
  await signinPage.signin(testController, credentials.admin);
  await adminNavBar.isLoggedIn(testController);
});

test('Test admin home page', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  await adminHomePage.isDisplayed(testController);
});
