import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../imports/ui/utilities/ComponentIDs';

class StudentNavBar {
  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector(`#${COMPONENTIDS.NAVBAR_CURRENT_USER}`).exists;
    if (loggedInUser) {
      await testController.click(`#${COMPONENTIDS.NAVBAR_CURRENT_USER}`);
      await testController.click(`#${COMPONENTIDS.NAVBAR_SIGN_OUT}`);
    }
  }

  async gotoHomePage(testController) {
    await testController.click('#student-menu-home');
  }

  async gotoInterestsExplorerPage(testController) {
    await testController.click('#student-menu-interests');
  }

  async gotoCourseExplorerPage(testController) {
    await testController.click('#student-menu-courses');
  }

  async gotoCareerGoalsExplorerPage(testController) {
    await testController.click('#student-menu-careers');
  }

  async gotoOpportunitiesPage(testController) {
    await testController.click('#student-menu-opportunities');
  }

  async gotoDegreePlannerPage(testController) {
    await testController.click('#student-menu-planner');
  }

  async gotoVerificationPage(testController) {
    await testController.click('#student-menu-verification');
  }

  async gotoVisibilityPage(testController) {
    await testController.click('#student-menu-visibility');
  }

  async gotoICEPointsPage(testController) {
    await testController.click('#student-menu-ice');
  }

  async gotoLevelsPage(testController) {
    await testController.click('#student-menu-levels');
  }

  async gotoReviewsPage(testController) {
    await testController.click('#student-menu-reviews');
  }

  async gotoCommunityPage(testController) {
    await testController.click('#student-menu-community');
  }

  async signout(testController) {
    await testController.click('#student-menu-signout');
  }
}

export const studentNavBar = new StudentNavBar();
