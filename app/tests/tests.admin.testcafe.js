import { landingPage } from './landing.page';
import { landingNavBar } from './landing.navbar.component';
import { adminHomePage } from './admin.home.page';
import { adminDataModelPage } from './admin.datamodel.page';
import { adminDatabasePage } from './admin.database.page';
import { adminModerationPage } from './admin.moderation.page';
import { adminAnalyticsPage } from './admin.analytics.page';
import { adminScoreboardPage } from './admin.scoreboard.page';
import { adminNavBar } from './admin.navbar.component';
import { signinPage } from './signin.page';

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
  await adminNavBar.gotoModerationPage(testController);
  await adminModerationPage.isDisplayed(testController);
  await adminNavBar.gotoAnalyticsPage(testController);
  await adminAnalyticsPage.isDisplayed(testController);
  await adminNavBar.gotoScoreboardPage(testController);
  await adminScoreboardPage.isDisplayed(testController);
});

test('Test admin data model page and subpages', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  const subPages = ['academic-plans', 'academic-terms', 'academic-year-instances', 'advisor-logs', 'career-goals',
  'course-instances', 'courses', 'feeds', 'feedback-instances', 'help-messages', 'interests',
  'interest-types', 'opportunities', 'opportunity-instances', 'opportunity-types', 'plan-choices', 'reviews',
  'slugs', 'teasers', 'users', 'verification-requests'];
  const promises = subPages.map(async (subPage) => adminNavBar.gotoDataModelPageSubPage(testController, subPage));
  await Promise.all(promises);
});
