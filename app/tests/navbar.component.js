import { Selector } from 'testcafe';

class NavBar {

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
    const name = Selector('div.ui.top.right.pointing.dropdown div.text');
    await testController.expect(name.textContent).eql(username);
  }

  /** Check that someone is logged in, then click items to logout. */
  async logout(testController) {
    // await testController.expect(Selector('#navbar-current-user').exists).ok();
    // await testController.click('#navbar-current-user');
    // await testController.click('#navbar-sign-out');
  }

}

export const navBar = new NavBar();
