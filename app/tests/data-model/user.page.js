import {
  firstNameSelector,
  lastNameSelector,
  pictureSelector,
  roleOption,
  roleSelector,
  usernameSelector, websiteSelector,
} from './selectors';

class UserPage {
  async addUser(t) {
    const username = 'johndoe@foo.edu';
    await t
      .typeText(usernameSelector, username)
      .expect(usernameSelector.value).eql(username);
    const role = 'FACULTY';
    await t
      .click(roleSelector)
      .click(roleOption.withText(role))
      .expect(roleSelector.value).eql(role);
    const firstName = 'John';
    await t
      .typeText(firstNameSelector, firstName)
      .expect(firstNameSelector.value).eql(firstName);
    const lastName = 'Doe';
    await t
      .typeText(lastNameSelector, lastName)
      .expect(lastNameSelector.value).eql(lastName);
    const picture = 'https://mywebsite.com/picture';
    await t
      .typeText(pictureSelector, picture)
      .expect(pictureSelector.value).eql(picture);
    const website = 'https://johndoe.github.io';
    await t
      .typeText(websiteSelector, website)
      .expect(websiteSelector.value).eql(website);
  }
}

export const userPage = new UserPage();
