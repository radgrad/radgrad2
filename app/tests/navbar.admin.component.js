import { Selector } from 'testcafe';

class AdminNavBar {

  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector('#navbar-current-user').exists;
    if (loggedInUser) {
      await testController.click('#navbar-current-user');
      await testController.click('#navbar-sign-out');
    }
  }

  async gotoAdminLogin(testController) {
    await testController.click('#LOGIN');
    await testController.click('#admin');
  }

  async gotoHomePage(testController) {
    await testController.click('#admin-menu-home');
  }

  async gotoPrivacyPage(testController) {
    await testController.click('#admin-menu-privacy');
  }

  async gotoForecastsPage(testController) {
    await testController.click('#admin-menu-forecasts');
  }

  async gotoCommunityPage(testController) {
    await testController.click('#admin-menu-community');
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

  async gotoDataModelPage(testController) {
    await testController.click('#second-menu-data-model');
  }

  async gotoDataModelPageSubPageAndVerify(testController, subPageId) {
    await testController.click('#second-menu-data-model');
    await testController.click(`#data-model-${subPageId}`);
    const pageIdSelector = Selector(`#data-model-${subPageId}-page`);
    await testController.expect(pageIdSelector.exists).ok();
  }

  async gotoDatabasePage(testController) {
    await testController.click('#second-menu-data-base');
  }

  async gotoAnalyticsPage(testController) {
    await testController.click('#second-menu-analytics');
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
