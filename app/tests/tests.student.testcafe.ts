import { COMPONENTIDS } from '../imports/ui/utilities/ComponentIDs';
import { landingNavBar } from './navbar.landing.component';
import { signinPage } from './signin.page';
import { studentHomePage } from './student.home.page';
import { studentNavBar } from './navbar.student.component';
import { explorerPages } from './explorer.pages';
import { managePages } from './manage.pages';
import { visibilityPage } from './visibility.page';
import { reviewPage } from './review.page';
import {
  studentDegreePlannerPage,
  studentICEPointsPage,
  studentLevelsPage,
  studentVerificationPage,
  studentReviewsPage,
  studentVisibilityPage,
  interestExplorerPage,
  careerGoalExplorerPage,
  courseExplorerPage,
  opportunityExplorerPage,
  communityPage,
  // internshipExplorerPage,
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

  // await studentNavBar.gotoInternshipsExplorerPage(testController);
  // await internshipExplorerPage.isDisplayed(testController);

  await studentNavBar.gotoDegreePlannerPage(testController);
  await studentDegreePlannerPage.isDisplayed(testController);

  await studentNavBar.gotoVerificationPage(testController);
  await studentVerificationPage.isDisplayed(testController);

  await studentNavBar.gotoVisibilityPage(testController);
  await studentVisibilityPage.isDisplayed(testController);

  await studentNavBar.gotoICEPointsPage(testController);
  await studentICEPointsPage.isDisplayed(testController);

  await studentNavBar.gotoLevelsPage(testController);
  await studentLevelsPage.isDisplayed(testController);

  await studentNavBar.gotoReviewsPage(testController);
  await studentReviewsPage.isDisplayed(testController);

  await studentNavBar.gotoCommunityPage(testController);
  await communityPage.isDisplayed(testController);
});

test('Test adding and removing interests, careers, courses, and opportunities to student profile', async (testController) => {
  await landingNavBar.gotoStudentLogin(testController);
  await signinPage.signin(testController, credentials.student.abi);

  await studentNavBar.gotoInterestsExplorerPage(testController);
  await explorerPages.testAddAndRemove(testController, 'angular');

  await studentNavBar.gotoCareerGoalsExplorerPage(testController);
  await explorerPages.testCareerAddAndRemove(testController, 'game-developer');

  await studentNavBar.gotoCourseExplorerPage(testController);
  await explorerPages.testAddAndRemove(testController, 'ics_102');

  await studentNavBar.gotoOpportunitiesPage(testController);
  await explorerPages.testAddAndRemove(testController, 'allnet');

});

test('Test student verification for opportunities', async (testController) => {
  await landingNavBar.gotoStudentLogin(testController);
  await signinPage.signin(testController, credentials.student.abi);

  await studentNavBar.gotoVerificationPage(testController);
  await managePages.studentRequestVerification(testController);
});

test('Test student visibility page', async (testController) => {
  await landingNavBar.gotoStudentLogin(testController);
  await signinPage.signin(testController, credentials.student.abi);

  await studentNavBar.gotoVisibilityPage(testController);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_PICTURE}`, `#${COMPONENTIDS.PROFILE_PICTURE}`);
  await visibilityPage.addWebsite(testController);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_WEBSITE}`, `#${COMPONENTIDS.PROFILE_WEBSITE}`);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_INTERESTS}`, `#${COMPONENTIDS.PROFILE_INTERESTS}`);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_CAREER_GOALS}`, `#${COMPONENTIDS.PROFILE_CAREER_GOALS}`);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_OPPORTUNITIES}`, `#${COMPONENTIDS.PROFILE_OPPORTUNITIES}`);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_COURSES}`, `#${COMPONENTIDS.PROFILE_COURSES}`);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_LEVEL}`, `#${COMPONENTIDS.PROFILE_LEVEL}`);
  await visibilityPage.testVisibility(testController, `#${COMPONENTIDS.SHARE_ICE}`, `#${COMPONENTIDS.PROFILE_ICE}`);
});

test('Test student adding a review', async (testController) => {
  await landingNavBar.gotoStudentLogin(testController);
  await signinPage.signin(testController, credentials.student.abi);

  await studentNavBar.gotoReviewsPage(testController);
  await reviewPage.testWriteReview(testController);
});
