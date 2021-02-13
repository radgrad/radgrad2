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
    await testController.click('#LOGIN');
    await testController.click('#admin');
  }

  async gotoStudentLogin(testController) {
    await testController.click('#LOGIN');
    await testController.click('#student');
  }

  async gotoFacultyLogin(testController) {
    await testController.click('#LOGIN');
    await testController.click('#faculty');
  }

  async gotoAdvisorLogin(testController) {
    await testController.click('#LOGIN');
    await testController.click('#advisor');
  }
}

export const landingNavBar = new LandingNavBar();
