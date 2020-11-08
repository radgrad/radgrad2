import { Selector } from 'testcafe';

class AdminModerationPage {
  constructor() {
    this.pageId = '#admin-moderation-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const adminModerationPage = new AdminModerationPage();
