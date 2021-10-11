import { Selector } from 'testcafe';
import { PAGEIDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENTIDS } from '../imports/ui/utilities/ComponentIDs';

class LandingPage {
  constructor() {
    this.pageId = `#${PAGEIDS.LANDING_HOME}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    const waitTime = 25;
    console.log(`Waiting ${waitTime} seconds before running LandingPage.isDisplayed().`);
    await testController.wait(waitTime * 1000).expect(this.pageSelector.exists).ok();
  }

  async gotoLanding(testController) {
    await testController.click(`#${COMPONENTIDS.LANDING_EXPLORER_MENU}`);
  }

  async gotoCareerGoalsExplorer(testController) {
    await testController.click(`#${COMPONENTIDS.LANDING_EXPLORER_BUTTONS}`);
    await testController.click(`#${COMPONENTIDS.LANDING_CAREER_GOALS_EXPLORER}`);
  }

  async gotoInterestsExplorer(testController) {
    await testController.click(`#${COMPONENTIDS.LANDING_EXPLORER_BUTTONS}`);
    await testController.click(`#${COMPONENTIDS.LANDING_INTERESTS_EXPLORER}`);
  }

  async gotoCoursesExplorer(testController) {
    await testController.click(`#${COMPONENTIDS.LANDING_EXPLORER_BUTTONS}`);
    await testController.click(`#${COMPONENTIDS.LANDING_COURSES_EXPLORER}`);
  }

  async gotoOpportunitiesExplorer(testController) {
    await testController.click(`#${COMPONENTIDS.LANDING_EXPLORER_BUTTONS}`);
    await testController.click(`#${COMPONENTIDS.LANDING_OPPORTUNITIES_EXPLORER}`);
  }
}

export const landingPage = new LandingPage();
