import { Selector } from 'testcafe';

class StudentCareerGoalsExplorerPage {
  constructor() {
    this.pageId = '#career-goals-explorer-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const studentCareerGoalsExplorerPage = new StudentCareerGoalsExplorerPage();
