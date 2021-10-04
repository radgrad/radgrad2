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
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_HOME}`);
  }

  async gotoInterestsExplorerPage(testController) {
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_EXPLORERS}`);
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_INTERESTS}`);
  }

  async gotoInternshipsExplorerPage(testController) {
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_EXPLORERS}`);
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_INTERNSHIPS}`);
  }

  async gotoCourseExplorerPage(testController) {
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_EXPLORERS}`);
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_COURSES}`);
  }

  async gotoCareerGoalsExplorerPage(testController) {
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_EXPLORERS}`);
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_CAREERS}`);

  }

  async gotoOpportunitiesPage(testController) {
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_EXPLORERS}`);
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_OPPORTUNITIES}`);

  }

  async gotoDegreePlannerPage(testController) {
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_PLANNER}`);
  }

  async gotoVerificationPage(testController) {
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_VERIFICATION}`);
  }

  async gotoVisibilityPage(testController) {
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_VISIBILITY}`);
  }

  async gotoICEPointsPage(testController) {
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_ICE}`);
  }

  async gotoLevelsPage(testController) {
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_LEVELS}`);
  }

  async gotoReviewsPage(testController) {
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_REVIEWS}`);
  }

  async gotoCommunityPage(testController) {
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_COMMUNITY}`);
  }

  async signout(testController) {
    await testController.click(`#${COMPONENTIDS.STUDENT_MENU_SIGNOUT}`);
  }
}

export const studentNavBar = new StudentNavBar();
