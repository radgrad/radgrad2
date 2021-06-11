import { Selector } from 'testcafe';

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
    }
  }

}

export const visibilityPage = new VisibilityPage();
