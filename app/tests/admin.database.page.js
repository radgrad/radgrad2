import { Selector } from 'testcafe';

class AdminDatabasePage {
  constructor() {
    this.pageId = '#admin-database-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const adminDatabasePage = new AdminDatabasePage();
