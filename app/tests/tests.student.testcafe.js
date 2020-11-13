import { landingPage } from './landing.page';
import { landingNavBar } from './landing.navbar.component';
import { signinPage } from './signin.page';
import { studentHomePage } from './student.home.page';
import { studentNavBar } from './student.navbar.component';
import { studentCoursesExplorerPage } from './student.courses.explorer.page';
import { studentCareerGoalsExplorerPage } from './student.career.goals.explorer.page';
import { studentInterestsExplorerPage } from './student.interests.explorer.page';
import { studentOpportunitiesPage } from './student.opportunities.page';
import { studentAcademicPlansExplorerPage } from './student.academic.plans.explorer.page';
import { studentDegreePlannerPage } from './student.degree.planner.page';

/* global fixture:false, test:false */

/** Credentials for sample user(s) defined in settings.development.json. */
const credentials = {
  student: {
    abi: { userName: 'abi@hawaii.edu', password: 'foo', accountName: 'abi', fullName: 'Abigail Kealoha' },
  },
};

fixture('Student UI acceptance tests').page('http://localhost:3200');

test('Test that landing page shows up', async (testController) => {
  // Note: landingPage.isDisplayed waits 10 seconds to ensure app comes up---needed for CI mode.
  // You probably want to skip this test during development, but make sure it's enabled before committing to master.
  await landingPage.isDisplayed(testController);
});

test('Test student login', async (testController) => {
  await landingNavBar.gotoStudentLogin(testController);
  await signinPage.signin(testController, credentials.student.abi);
  await studentHomePage.isDisplayed(testController);
});

test.only('Test all student top-level pages', async (testController) => {
  await landingNavBar.gotoStudentLogin(testController);
  await signinPage.signin(testController, credentials.student.abi);
  await studentNavBar.gotoCourseExplorerPage(testController);
  await studentCoursesExplorerPage.isDisplayed(testController);
  await studentNavBar.gotoCareerGoalsExplorerPage(testController);
  await studentCareerGoalsExplorerPage.isDisplayed(testController);
  await studentNavBar.gotoInterestsExplorerPage(testController);
  await studentInterestsExplorerPage.isDisplayed(testController);
  await studentNavBar.gotoAcademicPlansExplorerPage(testController);
  await studentAcademicPlansExplorerPage.isDisplayed(testController);

  await studentNavBar.gotoOpportunitiesPage(testController);
  await studentOpportunitiesPage.isDisplayed(testController);
  await studentNavBar.gotoDegreePlannerPage(testController);
  await studentDegreePlannerPage.isDisplayed(testController);
});
