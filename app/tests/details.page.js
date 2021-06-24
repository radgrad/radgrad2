/* eslint-disable no-await-in-loop */
import { Selector } from 'testcafe';
import { studentNavBar } from './navbar.student.component';

class DetailsPage {

  async gotoViewPageAndVerify(testController, pageName) {
    const linkSelector = await Selector(() => document.querySelectorAll('div[class="ui card"] a'));
    const linkCount = await linkSelector.count;

    for (let i = 0; i < linkCount; i++) {
      await testController.click(linkSelector.nth(i));
      const pageIdSelector = await Selector(`#${pageName}`);
      await testController.expect(pageIdSelector.exists).ok();
      await studentNavBar.gotoInterestsExplorerPage(testController);
    }
  }

}

export const detailsPage = new DetailsPage();
