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
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_EXPLORERS}`);
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_EXPLORER_CAREERS}`);
  }

  async gotoCoursesExplorerPage(testController) {
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_EXPLORERS}`);
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_EXPLORER_COURSES}`);
  }

  async gotoInterestsExplorerPage(testController) {
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_EXPLORERS}`);
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_EXPLORER_INTERESTS}`);
  }

  async gotoOpportunitiesExplorerPage(testController) {
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_EXPLORERS}`);
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_EXPLORER_OPPORTUNITIES}`);
  }

  async gotoManageOpportunitiesPage(testController) {
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_MANAGE}`);
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_MANAGE_OPPORTUNITIES}`);
  }

  async gotoManageVerificationPage(testController) {
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_MANAGE}`);
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_MANAGE_VERIFICATION}`);
  }

  async gotoManageReviewPage(testController) {
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_MANAGE}`);
    await testController.click(`#${COMPONENTIDS.FACULTY_MENU_MANAGE_REVIEW}`);
  }

  /** Check that the specified user is currently logged in. */
  async isLoggedIn(testController, credentials) {
    const usernameField = Selector(`#${COMPONENTIDS.FIRST_MENU_USERNAME}`)
      .child('div')
      .textContent;
    await testController.expect(usernameField).eql(credentials.userName);
  }
}

export const facultyNavBar = new FacultyNavBar();
