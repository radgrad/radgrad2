/* eslint-disable no-await-in-loop */
import { Selector } from 'testcafe';

class DetailsPage {

  async gotoViewPageAndVerify(testController, pageName, navbarFunction) {
    const linkSelector = await Selector(() => document.querySelectorAll('div[class="ui card"] a[class="ui button"]'));
    const linkCount = await linkSelector.count;

    for (let i = 0; i < linkCount; i++) {
      const failed = await linkSelector.nth(i).getAttribute('href');
      await testController.click(linkSelector.nth(i));
      try {
        const pageIdSelector = await Selector(`#${pageName}`);
        await testController.expect(pageIdSelector.exists).ok();
        await navbarFunction(testController);
      } catch {
        throw new Error(`${failed} failed to load.`);
      }

    }
  }

}

export const detailsPage = new DetailsPage();
