import { landingNavBar } from './navbar.landing.component';
import { signinPage } from './signin.page';
import { studentHomePage } from './student.home.page';
import { studentNavBar } from './navbar.student.component';
import {
  studentCareerGoalsExplorerPage,
  studentInterestsExplorerPage,
  studentOpportunitiesPage,
  studentDegreePlannerPage,
  studentCoursesExplorerPage,
  studentICEPointsPage,
  studentLevelsPage,
  studentVerificationPage,
  studentReviewsPage,
  studentCommunityPage,
  studentPrivacyPage,
  interestExplorerPage,
  careerGoalExplorerPage,
  courseExplorerPage,
  opportunityExplorerPage,
  communityPage,
} from './simple.page';

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

  await studentNavBar.gotoHomePage(testController);
  await studentHomePage.isDisplayed(testController);

  await studentNavBar.gotoInterestsExplorerPage(testController);
  await interestExplorerPage.isDisplayed(testController);

  await studentNavBar.gotoCareerGoalsExplorerPage(testController);
  await careerGoalExplorerPage.isDisplayed(testController);

  await studentNavBar.gotoCourseExplorerPage(testController);
  await courseExplorerPage.isDisplayed(testController);

  await studentNavBar.gotoOpportunitiesPage(testController);
  await opportunityExplorerPage.isDisplayed(testController);

  await studentNavBar.gotoDegreePlannerPage(testController);
  await studentDegreePlannerPage.isDisplayed(testController);

  await studentNavBar.gotoVerificationPage(testController);
  await studentVerificationPage.isDisplayed(testController);

  await studentNavBar.gotoPrivacyPage(testController);
  await studentPrivacyPage.isDisplayed(testController);

  await studentNavBar.gotoICEPointsPage(testController);
  await studentICEPointsPage.isDisplayed(testController);

  await studentNavBar.gotoLevelsPage(testController);
  await studentLevelsPage.isDisplayed(testController);

  await studentNavBar.gotoReviewsPage(testController);
  await studentReviewsPage.isDisplayed(testController);

  await studentNavBar.gotoCommunityPage(testController);
  await communityPage.isDisplayed(testController);
});
