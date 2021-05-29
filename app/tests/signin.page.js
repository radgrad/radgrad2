import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../imports/ui/utilities/ComponentIDs';

class SigninPage {
  constructor() {
    this.pageId = '#signin-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Fills out and submits the form to signin. */
  async signin(testController, credentials) {
    await this.isDisplayed(testController);
    await testController.typeText(`#${COMPONENTIDS.SIGNIN_FORM_EMAIL}`, credentials.userName);
    await testController.typeText(`#${COMPONENTIDS.SIGNIN_FORM_PASSWORD}`, credentials.password);
    await testController.click(`#${COMPONENTIDS.SIGNIN_FORM_SUBMIT}`);
  }
}

export const signinPage = new SigninPage();
