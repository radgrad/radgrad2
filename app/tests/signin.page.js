import { Selector } from 'testcafe';

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
    await testController.typeText('#signin-form-email', credentials.userName);
    await testController.typeText('#signin-form-password', credentials.password);
    await testController.click('#signin-form-submit');
  }
}

export const signinPage = new SigninPage();
