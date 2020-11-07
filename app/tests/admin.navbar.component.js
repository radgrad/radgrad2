import { Selector } from 'testcafe';

export class AdminNavBar {
  constructor(credentials) {
    this.credentials = credentials;
  }

  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector('#navbar-current-user').exists;
    if (loggedInUser) {
      await testController.click('#navbar-current-user');
      await testController.click('#navbar-sign-out');
    }
  }

  async gotoHomePage(testController) {
    await testController.click('#second-menu-home');
  }

  async gotoDataModelPage(testController) {
    await testController.click('#second-menu-data-model');
  }

  async gotoDataModelPageSubPage(testController, subPageId) {
    await testController.click('#second-menu-data-model');
    await testController.click(`#data-model-${subPageId}`);
  }

  async gotoDatabasePage(testController) {
    await testController.click('#second-menu-data-base');
  }

  async gotoModerationPage(testController) {
    await testController.click('#second-menu-moderation');
  }

  async gotoAnalyticsPage(testController) {
    await testController.click('#second-menu-analytics');
  }

  async gotoScoreboardPage(testController) {
    await testController.click('#second-menu-scoreboard');
  }

  async gotoAdminLogin(testController) {
    await testController.click('#LOGIN');
    await testController.click('#admin');
  }

  /** Check that the specified user is currently logged in. */
  async isLoggedIn(testController) {
    const usernameField = Selector('#first-menu-username')
      .child('div')
      .textContent;
    await testController.expect(usernameField).eql(this.credentials.username);
  }

  async gotoStudentHomePage(testController, credentials) {
    await testController.click(`#${credentials.accountName}`);
  }
}
