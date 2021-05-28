import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../imports/ui/utilities/ComponentIDs';

class AdvisorNavBar {

  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector(`#${COMPONENTIDS.NAVBAR_CURRENT_USER}`).exists;
    if (loggedInUser) {
      await testController.click(`#${COMPONENTIDS.NAVBAR_CURRENT_USER}`);
      await testController.click(`#${COMPONENTIDS.NAVBAR_SIGN_OUT}`);
    }
  }

  async gotoHomePage(testController) {
    await testController.click('#advisor-menu-home');
  }

  async gotoVisibilityPage(testController) {
    await testController.click('#advisor-menu-visibility');
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
