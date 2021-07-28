import { COMPONENTIDS } from '../imports/ui/utilities/ComponentIDs';
import { landingNavBar } from './navbar.landing.component';
import { adminNavBar } from './navbar.admin.component';
import { signinPage } from './signin.page';
import { landingPage } from './landing.page';
import { managePages } from './manage.pages';
import { visibilityPage } from './visibility.page';
import {
  adminHomePage,
  landingInterestExplorerPage,
  landingCareerGoalExplorerPage,
  landingCourseExplorerPage,
  landingOpportunityExplorerPage,
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

test('Test that the landing explorer pages show up', async (testController) => {
  await landingPage.gotoCareerGoalsExplorer(testController);
  await landingCareerGoalExplorerPage.isDisplayed(testController);
  await landingPage.gotoLanding(testController);
  await landingPage.gotoInterestsExplorer(testController);
  await landingInterestExplorerPage.isDisplayed(testController);
  await landingPage.gotoLanding(testController);
  await landingPage.gotoCoursesExplorer(testController);
  await landingCourseExplorerPage.isDisplayed(testController);
  await landingPage.gotoLanding(testController);
  await landingPage.gotoOpportunitiesExplorer(testController);
  await landingOpportunityExplorerPage.isDisplayed(testController);
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
  await adminNavBar.gotoMenuPageAndVerify(testController, 'analytics', 'behavior-table');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'analytics', 'logged-in-users');
});

test('Test admin management pages', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);
  // Unrolling the loop makes this easier to debug.
  await adminNavBar.gotoMenuPageAndVerify(testController, 'manage', 'students');
  await managePages.clickFilteredStudentsTabAndVerify(testController);
  await managePages.clickFilteredAlumniTabAndVerify(testController);
  await managePages.clickAddNewTabAndVerify(testController);
  await managePages.clickOtherTabAndVerify(testController);
  await managePages.clickMatriculateTabAndVerify(testController);
  await adminNavBar.gotoMenuPageAndVerify(testController, 'manage', 'verification');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'manage', 'reviews');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'manage', 'database');
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
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'interests');
  await adminNavBar.gotoMenuPageAndVerify(testController, 'data-model', 'interest-keywords');
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

test('Test admin visibility page', async (testController) => {
  await adminNavBar.gotoAdminLogin(testController);
  await signinPage.signin(testController, credentials.admin);

  await adminNavBar.gotoVisibilityPage(testController);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_PICTURE}`, `#${COMPONENTIDS.PROFILE_PICTURE}`);
  await visibilityPage.addWebsite(testController);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_WEBSITE}`, `#${COMPONENTIDS.PROFILE_WEBSITE}`);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_INTERESTS}`, `#${COMPONENTIDS.PROFILE_INTERESTS}`);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_CAREER_GOALS}`, `#${COMPONENTIDS.PROFILE_CAREER_GOALS}`);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_OPPORTUNITIES}`, `#${COMPONENTIDS.PROFILE_OPPORTUNITIES}`);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_COURSES}`, `#${COMPONENTIDS.PROFILE_COURSES}`);
});

test('Test admin ensure logout', async (testController) => {
  await adminNavBar.ensureLogout(testController);
});
