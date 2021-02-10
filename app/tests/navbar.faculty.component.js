import { Selector } from 'testcafe';

class FacultyNavBar {

  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector('#navbar-current-user').exists;
    if (loggedInUser) {
      await testController.click('#navbar-current-user');
      await testController.click('#navbar-sign-out');
    }
  }

  async gotoHomePage(testController) {
    await testController.click('#faculty-menu-home');
  }

  async gotoVerificationPage(testController) {
    await testController.click('#faculty-menu-verification');
  }

  async gotoReviewPage(testController) {
    await testController.click('#faculty-menu-review');
  }

  async gotoPrivacyPage(testController) {
    await testController.click('#faculty-menu-privacy');
  }

  async gotoScoreboardPage(testController) {
    await testController.click('#faculty-menu-scoreboard');
  }

  async gotoCommunityPage(testController) {
    await testController.click('#faculty-menu-community');
  }

  async gotoCareerGoalsExplorerPage(testController) {
    await testController.click('#faculty-menu-explorers');
    await testController.click('#faculty-menu-explorer-careers');
  }

  async gotoCoursesExplorerPage(testController) {
    await testController.click('#faculty-menu-explorers');
    await testController.click('#faculty-menu-explorer-courses');
  }

  async gotoInterestsExplorerPage(testController) {
    await testController.click('#faculty-menu-explorers');
    await testController.click('#faculty-menu-explorer-interests');
  }

  async gotoOpportunitiesExplorerPage(testController) {
    await testController.click('#faculty-menu-explorers');
    await testController.click('#faculty-menu-explorer-opportunities');
  }

  async gotoManageOpportunitiesPage(testController) {
    await testController.click('#faculty-menu-manage');
    await testController.click('#faculty-menu-manage-opportunities');
  }

  /** Check that the specified user is currently logged in. */
  async isLoggedIn(testController, credentials) {
    const usernameField = Selector('#first-menu-username')
      .child('div')
      .textContent;
    await testController.expect(usernameField).eql(credentials.userName);
  }
}

export const facultyNavBar = new FacultyNavBar();
