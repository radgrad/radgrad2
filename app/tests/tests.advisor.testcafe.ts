import { COMPONENTIDS } from '../imports/ui/utilities/ComponentIDs';
import { landingNavBar } from './navbar.landing.component';
import { advisorNavBar } from './navbar.advisor.component';
import { managePages } from './manage.pages';
import { signinPage } from './signin.page';
import { explorerPages } from './explorer.pages';
import { visibilityPage } from './visibility.page';
import {
  advisorHomePage,
  advisorFacultyVisibilityPage,
  forecastsPage,
  communityPage,
  careerGoalExplorerPage,
  courseExplorerPage,
  interestExplorerPage,
  opportunityExplorerPage,
  manageStudentsPage,
  manageVerificationPage,
  manageReviewsPage,
  manageOpportunitiesPage,
} from './simple.page';

// eslint-disable-next-line @typescript-eslint/no-redeclare
/* global fixture:false, test:false */

/** Credentials for sample user(s) defined in settings.development.json. */
const credentials = {
  advisor: { userName: 'kennydq@hawaii.edu', password: 'foo' },
};

fixture('Advisor UI acceptance tests').page('http://localhost:3200');

test('Test advisor login', async (testController) => {
  await landingNavBar.gotoAdminLogin(testController);
  await signinPage.isDisplayed(testController);
  await signinPage.signin(testController, credentials.advisor);
  await advisorNavBar.isLoggedIn(testController, credentials.advisor);
});

test('Test advisor top-level pages', async (testController) => {
  await landingNavBar.gotoStudentLogin(testController);
  await signinPage.signin(testController, credentials.advisor);

  await advisorNavBar.gotoHomePage(testController);
  await advisorHomePage.isDisplayed(testController);

  await advisorNavBar.gotoVisibilityPage(testController);
  await advisorFacultyVisibilityPage.isDisplayed(testController);

  await advisorNavBar.gotoForecastsPage(testController);
  await forecastsPage.isDisplayed(testController);

  await advisorNavBar.gotoCommunityPage(testController);
  await communityPage.isDisplayed(testController);

  await advisorNavBar.gotoCareerGoalsExplorerPage(testController);
  await careerGoalExplorerPage.isDisplayed(testController);

  await advisorNavBar.gotoCoursesExplorerPage(testController);
  await courseExplorerPage.isDisplayed(testController);

  await advisorNavBar.gotoInterestsExplorerPage(testController);
  await interestExplorerPage.isDisplayed(testController);

  await advisorNavBar.gotoOpportunitiesExplorerPage(testController);
  await opportunityExplorerPage.isDisplayed(testController);

  await advisorNavBar.gotoManageStudentsPage(testController);
  await manageStudentsPage.isDisplayed(testController);

  await advisorNavBar.gotoManageVerificationPage(testController);
  await manageVerificationPage.isDisplayed(testController);

  await advisorNavBar.gotoManageReviewPage(testController);
  await manageReviewsPage.isDisplayed(testController);

  await advisorNavBar.gotoManageOpportunitiesPage(testController);
  await manageOpportunitiesPage.isDisplayed(testController);
});

test('Test adding and removing interests, careers, courses and opportunities to advisor profile', async (testController) => {
  await landingNavBar.gotoAdvisorLogin(testController);
  await signinPage.signin(testController, credentials.advisor);

  await advisorNavBar.gotoInterestsExplorerPage(testController);
  await explorerPages.testAddAndRemove(testController, 'angular');

  await advisorNavBar.gotoCareerGoalsExplorerPage(testController);
  await explorerPages.testCareerAddAndRemove(testController, 'game-developer');

  await advisorNavBar.gotoCoursesExplorerPage(testController);
  await explorerPages.testAddAndRemove(testController, 'ics_102');

  await advisorNavBar.gotoOpportunitiesExplorerPage(testController);
  await explorerPages.testAddAndRemove(testController, 'allnet');
});

test('Test advisor manage student page', async (testController) => {
  await landingNavBar.gotoAdvisorLogin(testController);
  await signinPage.signin(testController, credentials.advisor);

  await advisorNavBar.gotoManageStudentsPage(testController);
  await managePages.clickAddNewTabAndVerify(testController);
  await managePages.addNewStudent(testController);
  await managePages.clickFilteredStudentsTabAndVerify(testController);
  await managePages.testStudentFilter(testController);
  await managePages.clickFilteredAlumniTabAndVerify(testController);
  await managePages.clickOtherTabAndVerify(testController);
  await managePages.clickMatriculateTabAndVerify(testController);
});

test('Test advisor manage opportunities page', async (testController) => {
  await landingNavBar.gotoAdvisorLogin(testController);
  await signinPage.signin(testController, credentials.advisor);

  await advisorNavBar.gotoManageOpportunitiesPage(testController);
  await managePages.clickEditOpportunities(testController);
});

test('Test advisor visibility page', async (testController) => {
  await landingNavBar.gotoAdvisorLogin(testController);
  await signinPage.signin(testController, credentials.advisor);

  await advisorNavBar.gotoVisibilityPage(testController);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_PICTURE}`, `#${COMPONENTIDS.PROFILE_PICTURE}`);
  await visibilityPage.addWebsite(testController);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_WEBSITE}`, `#${COMPONENTIDS.PROFILE_WEBSITE}`);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_INTERESTS}`, `#${COMPONENTIDS.PROFILE_INTERESTS}`);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_CAREER_GOALS}`, `#${COMPONENTIDS.PROFILE_CAREER_GOALS}`);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_OPPORTUNITIES}`, `#${COMPONENTIDS.PROFILE_OPPORTUNITIES}`);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_COURSES}`, `#${COMPONENTIDS.PROFILE_COURSES}`);
});
