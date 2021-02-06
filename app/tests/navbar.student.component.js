import { Selector } from 'testcafe';

class StudentNavBar {
  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector('#navbar-current-user').exists;
    if (loggedInUser) {
      await testController.click('#navbar-current-user');
      await testController.click('#navbar-sign-out');
    }
  }

  async gotoHomePage(testController) {
    await testController.click('#student-menu-home');
  }

  async gotoCourseExplorerPage(testController) {
    await testController.click('#student-menu-courses');
  }

  async gotoCareerGoalsExplorerPage(testController) {
    await testController.click('#student-menu-career-goals');
  }

  async gotoInterestsExplorerPage(testController) {
    await testController.click('#student-menu-interests');
  }

  async gotoOpportunitiesPage(testController) {
    await testController.click('#student-menu-opportunities');
  }

  async gotoDegreePlannerPage(testController) {
    await testController.click('#student-menu-degree-planner');
  }

  async gotoVerificationPage(testController) {
    await testController.click('#student-menu-verification');
  }

  async gotoPrivacyPage(testController) {
    await testController.click('#student-menu-privacy');
  }

  async gotoReviewsPage(testController) {
    await testController.click('#student-menu-reviews');
  }

  async gotoNewsPage(testController) {
    await testController.click('#student-menu-news');
  }

  async gotoCommunityUsersPage(testController) {
    await testController.click('#student-menu-community');
    await testController.click('#student-menu-users');
  }

  async gotoCommunityRadgradVideosPage(testController) {
    await testController.click('#student-menu-community');
    await testController.click('#student-menu-radgrad-videos');
  }

  async gotoICEPointsPage(testController) {
    await testController.click('#student-menu-ice-points');
  }

  async gotoLevelsPage(testController) {
    await testController.click('#student-menu-levels');
  }

  async signout(testController) {
    await testController.click('#student-menu-signout');
  }
}

export const studentNavBar = new StudentNavBar();
