import { Selector } from 'testcafe';

class StudentInterestsExplorerPage {
  constructor() {
    this.pageId = '#interests-explorer-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const studentInterestsExplorerPage = new StudentInterestsExplorerPage();
