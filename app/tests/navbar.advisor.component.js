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

  async gotoVerificationRequestsPage(testController) {
    await testController.click('#advisor-menu-verification-requests');
  }

  async gotoModerationPage(testController) {
    await testController.click('#advisor-menu-moderation');
  }

  async gotoScoreboardPage(testController) {
    await testController.click('#advisor-menu-scoreboard');
  }

  async gotoAcademicPlansExplorerPage(testController) {
    await testController.click('#advisor-menu-explore');
    await testController.click('#advisor-menu-academic-plans');
  }

  async gotoCareerGoalsExplorerPage(testController) {
    await testController.click('#advisor-menu-explore');
    await testController.click('#advisor-menu-career-goals');
  }

  async gotoCoursesExplorerPage(testController) {
    await testController.click('#advisor-menu-explore');
    await testController.click('#advisor-menu-courses');
  }

  async gotoInterestsExplorerPage(testController) {
    await testController.click('#advisor-menu-explore');
    await testController.click('#advisor-menu-interests');
  }

  async gotoOpportunitiesExplorerPage(testController) {
    await testController.click('#advisor-menu-explore');
    await testController.click('#advisor-menu-opportunities');
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
