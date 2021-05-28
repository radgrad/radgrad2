import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../imports/ui/utilities/ComponentIDs';

class FacultyNavBar {

  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector(`#${COMPONENTIDS.NAVBAR_CURRENT_USER}`).exists;
    if (loggedInUser) {
      await testController.click(`#${COMPONENTIDS.NAVBAR_CURRENT_USER}`);
      await testController.click(`#${COMPONENTIDS.NAVBAR_SIGN_OUT}`);
    }
  }

  async gotoHomePage(testController) {
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_HOME}`);
  }

  async gotoVisibilityPage(testController) {
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_VISIBILITY}`);
  }

  async gotoForecastsPage(testController) {
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_FORECASTS}`);
  }

  async gotoCommunityPage(testController) {
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_COMMUNITY}`);
  }

  async gotoCareerGoalsExplorerPage(testController) {
    await testController.click('#faculty-menu-explorers');
    await testController.click('#faculty-menu-explorer-careers');
  }

  async gotoCoursesExplorerPage(testController) {
    await testController.click('#faculty-menu-explorers');
    await testController.click('#faculty-menu-explorer-courses');
  }

  async gotoInterestsExplorerPage(testController) {
    await testController.click('#faculty-menu-explorers');
    await testController.click('#faculty-menu-explorer-interests');
  }

  async gotoOpportunitiesExplorerPage(testController) {
    await testController.click('#faculty-menu-explorers');
    await testController.click('#faculty-menu-explorer-opportunities');
  }

  async gotoManageOpportunitiesPage(testController) {
    await testController.click('#faculty-menu-manage');
    await testController.click('#faculty-menu-manage-opportunities');
  }

  async gotoManageVerificationPage(testController) {
    await testController.click('#faculty-menu-manage');
    await testController.click('#faculty-menu-manage-verification');
  }

  async gotoManageReviewPage(testController) {
    await testController.click('#faculty-menu-manage');
    await testController.click('#faculty-menu-manage-review');
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
