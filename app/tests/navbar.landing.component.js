import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../imports/ui/utilities/ComponentIDs';

class LandingNavBar {

  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector(`#${COMPONENTIDS.NAVBAR_CURRENT_USER}`).exists;
    if (loggedInUser) {
      await testController.click(`#${COMPONENTIDS.NAVBAR_CURRENT_USER}`);
      await testController.click(`#${COMPONENTIDS.NAVBAR_SIGN_OUT}`);
    }
  }

  async gotoAdminLogin(testController) {
    await testController.click(`#${COMPONENTIDS.LOGIN}`);
    await testController.click(`#${COMPONENTIDS.ADMIN}`);
  }

  async gotoStudentLogin(testController) {
    await testController.click(`#${COMPONENTIDS.LOGIN}`);
    await testController.click(`#${COMPONENTIDS.STUDENT}`);
  }

  async gotoFacultyLogin(testController) {
    await testController.click(`#${COMPONENTIDS.LOGIN}`);
    await testController.click(`#${COMPONENTIDS.FACULTY}`);
  }

  async gotoAdvisorLogin(testController) {
    await testController.click(`#${COMPONENTIDS.LOGIN}`);
    await testController.click(`#${COMPONENTIDS.ADVISOR}`);
  }
}

export const landingNavBar = new LandingNavBar();
