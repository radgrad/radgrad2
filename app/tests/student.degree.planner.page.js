import { Selector } from 'testcafe';

class StudentDegreePlannerPage {
  constructor() {
    this.pageId = '#degree-planner-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const studentDegreePlannerPage = new StudentDegreePlannerPage();
