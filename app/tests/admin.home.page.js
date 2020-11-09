import { Selector } from 'testcafe';

class AdminHomePage {
  constructor() {
    this.pageId = '#admin-home-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const adminHomePage = new AdminHomePage();
