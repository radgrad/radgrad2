import { Selector } from 'testcafe';

class AdminScoreboardPage {
  constructor() {
    this.pageId = '#scoreboard-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const adminScoreboardPage = new AdminScoreboardPage();