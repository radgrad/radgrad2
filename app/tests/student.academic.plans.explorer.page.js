import { Selector } from 'testcafe';

class StudentAcademicPlansExplorerPage {
  constructor() {
    this.pageId = '#plans-explorer-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const studentAcademicPlansExplorerPage = new StudentAcademicPlansExplorerPage();
