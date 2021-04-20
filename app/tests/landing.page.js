import { Selector } from 'testcafe';
import { PAGEIDS } from '../imports/ui/utilities/PageIDs';

class LandingPage {
  constructor() {
    this.pageId = `#${PAGEIDS.LANDING_HOME}`;
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
