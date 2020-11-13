import { Selector } from 'testcafe';

class StudentNavBar {

  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector('#navbar-current-user').exists;
    if (loggedInUser) {
      await testController.click('#navbar-current-user');
      await testController.click('#navbar-sign-out');
    }
  }

  async gotoHomePage(testController) {
    await testController.click('#second-menu-home');
  }

  async gotoCourseExplorerPage(testController) {
    await testController.click('#student-menu-explore');
    await testController.click('#student-menu-courses');
  }

  async gotoCareerGoalsExplorerPage(testController) {
    await testController.click('#student-menu-explore');
    await testController.click('#student-menu-career-goals');
  }

  async gotoInterestsExplorerPage(testController) {
    await testController.click('#student-menu-explore');
    await testController.click('#student-menu-interests');
  }

  async gotoAcademicPlansExplorerPage(testController) {
    await testController.click('#student-menu-explore');
    await testController.click('#student-menu-academic-plans');
  }

  async gotoOpportunitiesPage(testController) {
    await testController.click('#student-menu-opportunities');
  }

  async gotoDegreePlannerPage(testController) {
    await testController.click('#student-menu-degree-planner');
  }
}

export const studentNavBar = new StudentNavBar();
