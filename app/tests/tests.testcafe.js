import { LandingPage } from './landing.page';
import { AdminHomePage } from './admin.home.page';
import { AdminDataModelPage } from './admin.datamodel.page';
import { AdminDatabasePage } from './admin.database.page';
import { AdminModerationPage } from './admin.moderation.page';
import { AdminAnalyticsPage } from './admin.analytics.page';
import { AdminScoreboardPage } from './admin.scoreboard.page';
import { AdminNavBar } from './admin.navbar.component';
import { SigninPage } from './signin.page';
import { StudentHomePage } from './student.home.page';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = {
  admin: { userName: 'radgrad@hawaii.edu', password: 'foo' },
  student: {
    abi: { userName: 'abi@hawaii.edu', accountName: 'abi', fullName: 'Abigail Kealoha' },
  },
};

/* Create instances of page objects. */
const landingPage = new LandingPage();
const signinPage = new SigninPage();
const adminNavBar = new AdminNavBar(credentials.admin);
const adminHomePage = new AdminHomePage();
const adminDataModelPage = new AdminDataModelPage();
const adminDatabasePage = new AdminDatabasePage();
const adminModerationPage = new AdminModerationPage();
const adminAnalyticsPage = new AdminAnalyticsPage();
const adminScoreboardPage = new AdminScoreboardPage();

fixture('RadGrad localhost test with default db')
    .page('http://localhost:3200');

test('Test that landing page shows up', async (testController) => {
  // Note: landingPage.isDisplayed waits 10 seconds to ensure app comes up---needed for CI mode.
  // You probably want to skip this test during development, but make sure it's enabled before committing to master.
  await landingPage.isDisplayed(testController);
});

test('Test admin login', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.isDisplayed(testController);
  await signinPage.signin(testController, credentials.admin);
  await adminNavBar.isLoggedIn(testController);
});

test('Test all admin top-level pages', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
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

test.skip('NOT WORKING: Test student (abi) login', async (testController) => {
  const studentHomePage = new StudentHomePage(credentials.student.abi);
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  await adminNavBar.gotoStudentHomePage(testController, credentials.student.abi);
  await studentHomePage.isUser(testController);
});

test('Test admin data model page and subpages', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  const subPages = ['academic-plans', 'academic-terms', 'academic-year-instances', 'advisor-logs', 'career-goals',
  'course-instances', 'courses', 'desired-degrees', 'feeds', 'feedback-instances', 'help-messages', 'interests',
  'interest-types', 'opportunities', 'opportunity-instances', 'opportunity-types', 'plan-choices', 'reviews',
  'slugs', 'teasers', 'users', 'verification-requests'];
  const promises = subPages.map(async (subPage) => adminNavBar.gotoDataModelPageSubPage(testController, subPage));
  await Promise.all(promises);
});
