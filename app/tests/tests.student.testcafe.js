import { landingNavBar } from './navbar.landing.component';
import { signinPage } from './signin.page';
import { studentHomePage } from './student.home.page';
import { studentNavBar } from './navbar.student.component';
import { studentCareerGoalsExplorerPage, studentInterestsExplorerPage,
  studentOpportunitiesPage, studentDegreePlannerPage,
  studentCoursesExplorerPage, studentCommunityRadGradVideosPage, studentCommunityUsersPage,
  studentAboutMePage, studentICEPointsPage, studentLevelsPage } from './simple.page';

// eslint-disable-next-line @typescript-eslint/no-redeclare
/* global fixture:false, test:false */

/** Credentials for sample user(s) defined in settings.development.json. */
const credentials = {
  student: {
    abi: { userName: 'abi@hawaii.edu', password: 'foo', accountName: 'abi', fullName: 'Abigail Kealoha' },
  },
};

fixture('Student UI acceptance tests').page('http://localhost:3200');

test('Test student login', async (testController) => {
  await landingNavBar.gotoStudentLogin(testController);
  await signinPage.signin(testController, credentials.student.abi);
  await studentHomePage.isDisplayed(testController);
});

test('Test all student top-level pages', async (testController) => {
  await landingNavBar.gotoStudentLogin(testController);
  await signinPage.signin(testController, credentials.student.abi);

  await studentNavBar.gotoCourseExplorerPage(testController);
  await studentCoursesExplorerPage.isDisplayed(testController);

  await studentNavBar.gotoCareerGoalsExplorerPage(testController);
  await studentCareerGoalsExplorerPage.isDisplayed(testController);

  await studentNavBar.gotoInterestsExplorerPage(testController);
  await studentInterestsExplorerPage.isDisplayed(testController);

  await studentNavBar.gotoOpportunitiesPage(testController);
  await studentOpportunitiesPage.isDisplayed(testController);

  await studentNavBar.gotoDegreePlannerPage(testController);
  await studentDegreePlannerPage.isDisplayed(testController);

  await studentNavBar.gotoCommunityUsersPage(testController);
  await studentCommunityUsersPage.isDisplayed(testController);

  await studentNavBar.gotoCommunityRadgradVideosPage(testController);
  await studentCommunityRadGradVideosPage.isDisplayed(testController);

  await studentNavBar.gotoAboutMePage(testController);
  await studentAboutMePage.isDisplayed(testController);

  await studentNavBar.gotoICEPointsPage(testController);
  await studentICEPointsPage.isDisplayed(testController);

  await studentNavBar.gotoLevelsPage(testController);
  await studentLevelsPage.isDisplayed(testController);

});
