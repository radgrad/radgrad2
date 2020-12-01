import { Selector } from 'testcafe';

class StudentHomePage {
  constructor() {
    this.pageId = '#student-home-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Asserts that this page is currently displayed. */
  async isUser(testController, credentials) {
    const userFullNameField = Selector('#dropdown-user-fullname').child('div').textContent;
    await testController.expect(userFullNameField).eql(credentials.fullName);
  }
}

export const studentHomePage = new StudentHomePage();
