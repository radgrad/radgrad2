import { Selector } from 'testcafe';

export class NavBar {

  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector('#navbar-current-user').exists;
    if (loggedInUser) {
      await testController.click('#navbar-current-user');
      await testController.click('#navbar-sign-out');
    }
  }

  async gotoAdminLogin(testController) {
    // await this.ensureLogout(testController);
    await testController.click('#LOGIN');
    await testController.click('#admin');
  }

  /** Check that the specified user is currently logged in. */
  async isLoggedIn(testController, username) {
    const usernameField = Selector('#first-menu-username')
      .child('div')
      .textContent;
    await testController.expect(usernameField).eql(username);
  }
}
