import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../imports/ui/utilities/ComponentIDs';

class VisibilityPage {

  async testVisibility(testController, checkboxSelectorID, componentSelectorID) {
    const checkboxSelector = Selector(checkboxSelectorID);
    const selectorChecked = await checkboxSelector().checked;
    if (selectorChecked) {
      let componentSelector = Selector(componentSelectorID);
      await testController.expect(componentSelector.exists).ok();
      await testController.click(checkboxSelectorID);
      componentSelector = Selector(componentSelectorID);
      await testController.expect(componentSelector.exists).notOk();
    } else {
      let componentSelector = Selector(componentSelectorID);
      await testController.expect(componentSelector.exists).notOk();
      await testController.click(checkboxSelectorID);
      componentSelector = Selector(componentSelectorID);
      await testController.expect(componentSelector.exists).ok();
    }
  }

  async addWebsite(testController) {
    await testController.click(`#${COMPONENTIDS.SET_WEBSITE_BUTTON}`);
    await testController.typeText(`#${COMPONENTIDS.SET_WEBSITE_TEXT}`, 'https://www.mywebsite.com');
    await testController.click(`#${COMPONENTIDS.SUBMIT_WEBSITE_BUTTON}`);
  }

}

export const visibilityPage = new VisibilityPage();
