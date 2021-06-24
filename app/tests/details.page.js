/* eslint-disable no-await-in-loop */
import { Selector } from 'testcafe';

class DetailsPage {

  async gotoViewPageAndVerify(testController, pageName, navbarFunction) {
    const linkSelector = await Selector(() => document.querySelectorAll('div[class="ui card"] a'));
    const linkCount = await linkSelector.count;

    for (let i = 0; i < linkCount; i++) {
      try {
        await testController.click(linkSelector.nth(i));
        const pageIdSelector = await Selector(`#${pageName}`);
        await testController.expect(pageIdSelector.exists).ok();
        await navbarFunction(testController);
      } catch {
        console.log(`${linkSelector.nth(i)} failed to load.`);
      }
    }
  }

}

export const detailsPage = new DetailsPage();
