import { Selector } from 'testcafe';

class AdvisorNavBar {

  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector('#navbar-current-user').exists;
    if (loggedInUser) {
      await testController.click('#navbar-current-user');
      await testController.click('#navbar-sign-out');
    }
  }

  async gotoHomePage(testController) {
    await testController.click('#advisor-menu-home');
  }

  async gotoPrivacyPage(testController) {
    await testController.click('#advisor-menu-privacy');
  }

  async gotoForecastsPage(testController) {
    await testController.click('#advisor-menu-forecasts');
  }

  async gotoCommunityPage(testController) {
    await testController.click('#advisor-menu-community');
  }

  async gotoCareerGoalsExplorerPage(testController) {
    await testController.click('#advisor-menu-explorers');
    await testController.click('#advisor-menu-explorer-careers');
  }

  async gotoCoursesExplorerPage(testController) {
    await testController.click('#advisor-menu-explorers');
    await testController.click('#advisor-menu-explorer-courses');
  }

  async gotoInterestsExplorerPage(testController) {
    await testController.click('#advisor-menu-explorers');
    await testController.click('#advisor-menu-explorer-interests');
  }

  async gotoOpportunitiesExplorerPage(testController) {
    await testController.click('#advisor-menu-explorers');
    await testController.click('#advisor-menu-explorer-opportunities');
  }

  async gotoManageStudentsPage(testController) {
    await testController.click('#advisor-menu-manage');
    await testController.click('#advisor-menu-manage-students');
  }

  async gotoManageVerificationPage(testController) {
    await testController.click('#advisor-menu-manage');
    await testController.click('#advisor-menu-manage-verification');
  }

  async gotoManageReviewPage(testController) {
    await testController.click('#advisor-menu-manage');
    await testController.click('#advisor-menu-manage-review');
  }

  async gotoManageOpportunitiesPage(testController) {
    await testController.click('#advisor-menu-manage');
    await testController.click('#advisor-menu-manage-opportunities');
  }

  /** Check that the specified user is currently logged in. */
  async isLoggedIn(testController, credentials) {
    const usernameField = Selector('#first-menu-username')
      .child('div')
      .textContent;
    await testController.expect(usernameField).eql(credentials.userName);
  }
}

export const advisorNavBar = new AdvisorNavBar();
