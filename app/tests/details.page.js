import { Selector } from 'testcafe';

class DetailsPage {

  async gotoViewPageAndVerify(testController, slugName, pageName) {
    await testController.click(`#see-details-${slugName}-button`);
    const pageIdSelector = Selector(`#${pageName}`);
    await testController.expect(pageIdSelector.exists).ok();
  }

}

export const detailsPage = new DetailsPage();