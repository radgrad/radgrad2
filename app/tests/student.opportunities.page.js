import { Selector } from 'testcafe';

class StudentOpportunitiesPage {
  constructor() {
    this.pageId = '#student-opportunities-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const studentOpportunitiesPage = new StudentOpportunitiesPage();
