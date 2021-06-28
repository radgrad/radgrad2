import {
  descriptionSelector, errorFieldSelector,
  interestTypeOption,
  interestTypeSelector,
  nameSelector,
  pictureSelector, submitSelector,
} from './selectors';

class InterestPage {
  async addInterest(t) {
    const interestName = 'Non Quantum Computing';
    await t
      .typeText(nameSelector, interestName)
      .expect(nameSelector.value).eql(interestName);
    const interestType = 'technologies';
    await t
      .click(interestTypeSelector)
      .click(interestTypeOption.withText(interestType))
      .expect(interestTypeSelector.value).eql(interestType);
    const picture = 'https://mywebsite.com/picture';
    await t
      .typeText(pictureSelector, picture)
      .expect(pictureSelector.value).eql(picture);
    const description = 'Techniques for computing quantum states without a quantum computer.';
    await t
      .typeText(descriptionSelector, description)
      .expect(descriptionSelector.value).eql(description);
    await t.click(submitSelector);
    await t.expect(errorFieldSelector.exists).notOk;
    // give things time to propagate
    await t.wait(1000);
    // check the reset form
    await t
      .expect(nameSelector.value).eql('')
      .expect(pictureSelector.value).eql('')
      .expect(descriptionSelector.value).eql('')
      .expect(interestTypeSelector.value).eql('CS Disciplines');
  }
}

export const interestPage = new InterestPage();
