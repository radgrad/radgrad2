import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../imports/ui/utilities/ComponentIDs';

class AdminNavBar {

  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector(`#${COMPONENTIDS.NAVBAR_CURRENT_USER}`).exists;
    if (loggedInUser) {
      await testController.click(`#${COMPONENTIDS.NAVBAR_CURRENT_USER}`);
      await testController.click(`#${COMPONENTIDS.NAVBAR_SIGN_OUT}`);
    }
  }

  async gotoAdminLogin(testController) {
    await testController.click('#LOGIN');
    await testController.click('#admin');
  }

  async gotoHomePage(testController) {
    await testController.click('#admin-menu-home');
  }

  async gotoVisibilityPage(testController) {
    await testController.click('#admin-menu-visibility');
  }

  async gotoForecastsPage(testController) {
    await testController.click('#admin-menu-forecasts');
  }

  async gotoCommunityPage(testController) {
    await testController.click('#admin-menu-community');
  }

  async gotoCareerGoalsExplorerPage(testController) {
    await testController.click('#admin-menu-explorers');
    await testController.click('#admin-menu-explorer-careers');
  }

  async gotoCoursesExplorerPage(testController) {
    await testController.click('#admin-menu-explorers');
    await testController.click('#admin-menu-explorer-courses');
  }

  async gotoInterestsExplorerPage(testController) {
    await testController.click('#admin-menu-explorers');
    await testController.click('#admin-menu-explorer-interests');
  }

  async gotoOpportunitiesExplorerPage(testController) {
    await testController.click('#admin-menu-explorers');
    await testController.click('#admin-menu-explorer-opportunities');
  }

  async gotoManageStudentsPage(testController) {
    await testController.click('#admin-menu-manage');
    await testController.click('#admin-menu-manage-students');
  }

  async gotoManageVerificationPage(testController) {
    await testController.click('#admin-menu-manage');
    await testController.click('#admin-menu-manage-verification');
  }

  async gotoManageReviewPage(testController) {
    await testController.click('#admin-menu-manage');
    await testController.click('#admin-menu-manage-review');
  }

  async gotoMenuPageAndVerify(testController, menu, pageName) {
    await testController.click(`#admin-menu-${menu}`);
    await testController.click(`#admin-menu-${menu}-${pageName}`);
    const pageIdSelector = Selector(`#${menu}-${pageName}-page`);
    await testController.expect(pageIdSelector.exists).ok();
  }

  /** Check that the specified user is currently logged in. */
  async isLoggedIn(testController, credentials) {
    const usernameField = Selector('#first-menu-username')
      .child('div')
      .textContent;
    await testController.expect(usernameField).eql(credentials.userName);
  }
}

export const adminNavBar = new AdminNavBar();
