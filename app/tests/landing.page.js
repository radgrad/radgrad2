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

  async gotoLanding(testController) {
    await testController.click('#landing-explorer-menu');
  }

  async gotoCareerGoalsExplorer(testController) {
    await testController.click('#landing-explorer-buttons');
    await testController.click('#landing-career-goals-explorer');
  }

  async gotoInterestsExplorer(testController) {
    await testController.click('#landing-explorer-buttons');
    await testController.click('#landing-interests-explorer');
  }

  async gotoCoursesExplorer(testController) {
    await testController.click('#landing-explorer-buttons');
    await testController.click('#landing-courses-explorer');
  }

  async gotoOpportunitiesExplorer(testController) {
    await testController.click('#landing-explorer-buttons');
    await testController.click('#landing-opportunities-explorer');
  }
}

export const landingPage = new LandingPage();
