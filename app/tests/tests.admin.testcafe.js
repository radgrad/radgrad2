import { landingNavBar } from './navbar.landing.component';
import { adminNavBar } from './navbar.admin.component';
import { signinPage } from './signin.page';
import { landingPage } from './landing.page';
import {
  adminAnalyticsPage,
  adminDatabasePage,
  adminDataModelPage,
  adminHomePage,
} from './simple.page';

// eslint-disable-next-line @typescript-eslint/no-redeclare
/* global fixture:false, test:false */

/** Credentials for sample user(s) defined in settings.development.json. */
const credentials = {
  admin: { userName: 'radgrad@hawaii.edu', password: 'foo' },
};

fixture('Admin UI acceptance tests').page('http://localhost:3200');

test('Test that landing page shows up', async (testController) => {
  // Note: landingPage.isDisplayed waits 10 seconds to ensure app comes up---needed for CI mode.
  // You probably want to skip this test during development, but make sure it's enabled before committing to master.
  await landingPage.isDisplayed(testController);
});

test('Test admin login', async (testController) => {
  await landingNavBar.gotoAdminLogin(testController);
  await signinPage.isDisplayed(testController);
  await signinPage.signin(testController, credentials.admin);
  await adminNavBar.isLoggedIn(testController, credentials.admin);
});

test('Test all admin top-level pages', async (testController) => {
  await landingNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  await adminHomePage.isDisplayed(testController);

  await adminNavBar.gotoHomePage(testController);
  await adminHomePage.isDisplayed(testController);

  await adminNavBar.gotoDataModelPage(testController);
  await adminDataModelPage.isDisplayed(testController);

  await adminNavBar.gotoDatabasePage(testController);
  await adminDatabasePage.isDisplayed(testController);

  // await adminNavBar.gotoModerationPage(testController);
  // await adminModerationPage.isDisplayed(testController);

  await adminNavBar.gotoAnalyticsPage(testController);
  await adminAnalyticsPage.isDisplayed(testController);

  // await adminNavBar.gotoScoreboardPage(testController);
  // await adminScoreboardPage.isDisplayed(testController);
});

test('Test admin data model page and subpages', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  const subPages = ['academic-terms', 'academic-year-instances', 'careergoals',
    'course-instances', 'courses', 'feeds', 'feedback-instances', 'help-messages', 'interests',
    'interest-types', 'opportunities', 'opportunity-instances', 'opportunity-types', 'reviews',
    'slugs', 'teasers', 'users', 'verification-requests'];
  // const promises = subPages.map(async (subPage) => adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPage));
  // await Promise.all(promises);
  // We do it this way instead of the above map() and Promise.all() because it's much easier to debug.
  await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[0]);
  await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[1]);
  // await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[2]);
  await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[3]);
  await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[4]);
  await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[5]);
  await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[6]);
  await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[7]);
  await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[8]);
  await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[9]);
  await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[10]);
  await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[11]);
  await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[12]);
  await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[13]);
  await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[14]);
  await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[15]);
  await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[16]);
  await adminNavBar.gotoDataModelPageSubPageAndVerify(testController, subPages[17]);
});

test('Test admin ensure logout', async (testController) => {
  await adminNavBar.ensureLogout(testController);
});
