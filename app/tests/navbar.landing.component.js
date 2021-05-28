import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../imports/ui/utilities/ComponentIDs';

class LandingNavBar {

  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector(`#${COMPONENTIDS.NAVBAR_CURRENT_USER}`).exists;
    if (loggedInUser) {
      await testController.click(`#${COMPONENTIDS.NAVBAR_CURRENT_USER}`);
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
