import { Selector } from 'testcafe';

class LandingPage {
  constructor() {
    this.pageId = '#landing-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    const waitTime = 20;
    console.log(`Waiting ${waitTime} seconds before running LandingPage.isDisplayed().`);
    await testController.wait(waitTime * 1000).expect(this.pageSelector.exists).ok();
  }
}

export const landingPage = new LandingPage();
