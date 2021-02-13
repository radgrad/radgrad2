import { landingNavBar } from './navbar.landing.component';
import { adminNavBar } from './navbar.admin.component';
import { signinPage } from './signin.page';
import { landingPage } from './landing.page';
import {
  adminHomePage,
} from './simple.page';

// eslint-disable-next-line @typescript-eslint/no-redeclare
/* global fixture:false, test:false */

/** Credentials for sample user(s) defined in settings.development.json. */
const credentials = {
  admin: { userName: 'radgrad@hawaii.edu', password: 'foo' },
};

fixture('Admin UI acceptance tests').page('http://localhost:3200');

test.skip('Test that landing page shows up', async (testController) => {
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

});

test('Test admin analytics pages', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  // Unrolling the loop makes this easier to debug.
  await adminNavBar.gotoMenuPageAndVerify(testController, 'analytics', 'newsletter');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'analytics', 'overhead-analysis');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'analytics', 'student-summary');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'analytics', 'logged-in-users');
});

test('Test admin database pages', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  // Unrolling the loop makes this easier to debug.
  await adminNavBar.gotoMenuPageAndVerify(testController, 'database', 'dump-database');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'database', 'check-integrity');
});

test('Test admin data model pages', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  // Unrolling the loop makes this easier to debug.
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'academic-terms');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'academic-year-instances');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'career-goals');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'course-instances');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'courses');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'feeds');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'feedback-instances');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'interests');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'interest-types');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'opportunities');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'opportunity-instances');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'opportunity-types');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'reviews');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'slugs');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'teasers');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'users');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'verification-requests');
});

test('Test admin ensure logout', async (testController) => {
  await adminNavBar.ensureLogout(testController);
});
