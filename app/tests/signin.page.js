import { Selector } from 'testcafe';
import { NavBar } from './navbar.component';

const navBar = new NavBar();

export class SigninPage {
  constructor() {
    this.pageId = '#signin-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Fills out and submits the form to signin, then checks to see that login was successful. */
  async signin(testController, credentials) {
    await this.isDisplayed(testController);
    await testController.typeText('#signin-form-email', credentials.userName);
    await testController.typeText('#signin-form-password', credentials.password);
    await testController.click('#signin-form-submit');
    await navBar.isLoggedIn(testController, credentials.userName);
  }
}
