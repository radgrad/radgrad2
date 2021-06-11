import { landingNavBar } from './navbar.landing.component';
import { facultyNavBar } from './navbar.faculty.component';
import { signinPage } from './signin.page';
import { explorerPages } from './explorer.pages';
import {
  facultyHomePage,
  manageOpportunitiesPage,
  manageReviewsPage,
  communityPage,
  forecastsPage,
  careerGoalExplorerPage,
  interestExplorerPage,
  opportunityExplorerPage,
  courseExplorerPage,
  advisorFacultyVisibilityPage,
  manageVerificationPage,
} from './simple.page';

// eslint-disable-next-line @typescript-eslint/no-redeclare
/* global fixture:false, test:false */

/** Credentials for sample user(s) defined in settings.development.json. */
const credentials = {
  faculty: { userName: 'esb@hawaii.edu', password: 'foo' },
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

  await facultyNavBar.gotoVisibilityPage(testController);
  await advisorFacultyVisibilityPage.isDisplayed(testController);

  await facultyNavBar.gotoForecastsPage(testController);
  await forecastsPage.isDisplayed(testController);

  await facultyNavBar.gotoCommunityPage(testController);
  await communityPage.isDisplayed(testController);

  await facultyNavBar.gotoCareerGoalsExplorerPage(testController);
  await careerGoalExplorerPage.isDisplayed(testController);

  await facultyNavBar.gotoCoursesExplorerPage(testController);
  await courseExplorerPage.isDisplayed(testController);

  await facultyNavBar.gotoInterestsExplorerPage(testController);
  await interestExplorerPage.isDisplayed(testController);

  await facultyNavBar.gotoOpportunitiesExplorerPage(testController);
  await opportunityExplorerPage.isDisplayed(testController);

  await facultyNavBar.gotoManageOpportunitiesPage(testController);
  await manageOpportunitiesPage.isDisplayed(testController);

  await facultyNavBar.gotoManageVerificationPage(testController);
  await manageVerificationPage.isDisplayed(testController);

  await facultyNavBar.gotoManageReviewPage(testController);
  await manageReviewsPage.isDisplayed(testController);

});

test('Test adding and removing interests and careers to faculty profile', async (testController) => {
  await landingNavBar.gotoFacultyLogin(testController);
  await signinPage.signin(testController, credentials.faculty);

  await facultyNavBar.gotoInterestsExplorerPage(testController);
  await explorerPages.testAddAndRemove(testController, 'angular');

  await facultyNavBar.gotoCareerGoalsExplorerPage(testController);
  await explorerPages.testAddAndRemove(testController, 'game-developer');
});
