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

  async gotoManageOpportunitiesPage(testController) {
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
