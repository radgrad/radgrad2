import { Selector } from 'testcafe';

export class AdminAnalyticsPage {
  constructor() {
    this.pageId = '#admin-analytics-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}
