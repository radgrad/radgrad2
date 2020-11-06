import { Selector } from 'testcafe';

export class StudentHomePage {
  constructor(credentials) {
    this.credentials = credentials;
    this.pageId = '#student-home-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Asserts that this page is currently displayed. */
  async isUser(testController) {
    const userFullNameField = Selector('#dropdown-user-fullname')
        .child('div')
        .textContent;
    await testController.expect(userFullNameField).eql(this.credentials.fullName);
  }
}
