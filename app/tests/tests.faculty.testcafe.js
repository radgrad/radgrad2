import { landingNavBar } from './navbar.landing.component';
import { facultyNavBar } from './navbar.faculty.component';
import { signinPage } from './signin.page';
import { facultyHomePage, facultyManageOpportunitiesPage, facultyVerificationPage, facultyReviewPage, facultyCareerGoalsPage, facultyCommunityPage, facultyCoursesPage, facultyInterestsPage, facultyOpportunitiesPage, facultyPrivacyPage, facultyScoreboardPage } from './simple.page';

// eslint-disable-next-line @typescript-eslint/no-redeclare
/* global fixture:false, test:false */

/** Credentials for sample user(s) defined in settings.development.json. */
const credentials = {
  faculty: { userName: 'johnson@hawaii.edu', password: 'foo' },
};

fixture('Faculty UI acceptance tests').page('http://localhost:3200');

test('Test faculty login', async (testController) => {
  await landingNavBar.gotoFacultyLogin(testController);
  await signinPage.isDisplayed(testController);
  await signinPage.signin(testController, credentials.faculty);
  await facultyNavBar.isLoggedIn(testController, credentials.faculty);
});

test('Test faculty top-level pages', async (testController) => {
  await landingNavBar.gotoFacultyLogin(testController);
  await signinPage.signin(testController, credentials.faculty);

  await facultyNavBar.gotoHomePage(testController);
  await facultyHomePage.isDisplayed(testController);

  await facultyNavBar.gotoVerificationPage(testController);
  await facultyVerificationPage.isDisplayed(testController);

  await facultyNavBar.gotoReviewPage(testController);
  await facultyReviewPage.isDisplayed(testController);

  await facultyNavBar.gotoPrivacyPage(testController);
  await facultyPrivacyPage.isDisplayed(testController);

  await facultyNavBar.gotoScoreboardPage(testController);
  await facultyScoreboardPage.isDisplayed(testController);

  await facultyNavBar.gotoCommunityPage(testController);
  await facultyCommunityPage.isDisplayed(testController);

  await facultyNavBar.gotoCoursesExplorerPage(testController);
  await facultyCoursesPage.isDisplayed(testController);

  await facultyNavBar.gotoCareerGoalsExplorerPage(testController);
  await facultyCareerGoalsPage.isDisplayed(testController);

  await facultyNavBar.gotoInterestsExplorerPage(testController);
  await facultyInterestsPage.isDisplayed(testController);

  await facultyNavBar.gotoOpportunitiesExplorerPage(testController);
  await facultyOpportunitiesPage.isDisplayed(testController);

  await facultyNavBar.gotoManageOpportunitiesPage(testController);
  await facultyManageOpportunitiesPage.isDisplayed(testController);
});
