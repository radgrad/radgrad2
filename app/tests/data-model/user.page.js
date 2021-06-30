import {
  careerGoalNames,
  careerGoalOption,
  careerGoalSelector, errorFieldSelector,
  firstNameSelector, interestNames, interestsOption, interestsSelector,
  lastNameSelector,
  pictureSelector,
  roleOption,
  roleSelector, submitSelector,
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
    await t
      .click(interestsSelector)
      .click(interestsOption.withText(interestNames.civic_engagement))
      .click(interestsOption.withText(interestNames.data_science));
    await t
      .click(careerGoalSelector)
      .click(careerGoalOption.withText(careerGoalNames.teacher))
      .click(careerGoalOption.withText(careerGoalNames.grad));
    // submit the form
    await t.click(submitSelector);
    await t.expect(errorFieldSelector.exists).notOk;
    // give things time to propagate
    await t.wait(1000);
    await t
      .expect(usernameSelector.value).eql('')
      .expect(firstNameSelector.value).eql('')
      .expect(lastNameSelector.value).eql('');
  }
}

export const userPage = new UserPage();
