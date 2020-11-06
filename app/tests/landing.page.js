import { Selector } from 'testcafe';

export class LandingPage {
  constructor() {
    this.pageId = '#landing-section-1';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }
}
