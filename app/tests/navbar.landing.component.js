import { Selector } from 'testcafe';

class LandingNavBar {

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

  async gotoStudentLogin(testController) {
    // await this.ensureLogout(testController);
    await testController.click('#LOGIN');
    await testController.click('#student');
  }
}

export const landingNavBar = new LandingNavBar();
