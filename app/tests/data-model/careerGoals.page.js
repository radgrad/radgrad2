import {
  descriptionSelector, errorFieldSelector, interestNames,
  interestsOption,
  interestsSelector,
  nameSelector,
  pictureSelector,
  submitSelector,
} from './selectors';

class CareerGoalsPage {
  async addCareerGoal(t) {
    // console.log('inside addCareerGoal', t);
    const name = 'Quantum Software Developer';
    const interest1 = interestNames.quantum_computing;
    const interest2 = interestNames.software_engineering;
    const picture = 'https://mywebsite.com/picture';
    const description = 'The new software engineering using quantum code.';
    await t.selectText(nameSelector)
      .typeText(nameSelector, name)
      .expect(nameSelector.value).eql(name);
    await t
      .click(pictureSelector)
      .typeText(pictureSelector, picture)
      .expect(pictureSelector.value).eql(picture);
    await t
      .typeText(descriptionSelector, description)
      .expect(descriptionSelector.value).eql(description);
    await t
      .click(interestsSelector)
      .click(interestsOption.withText(interest1))
      .click(interestsOption.withText(interest2));
    await t.click(submitSelector);
    await t.expect(errorFieldSelector.exists).notOk;
    // give things time to propagate
    await t.wait(500);
    await t
      .expect(nameSelector.value).eql('')
      .expect(pictureSelector.value).eql('')
      .expect(descriptionSelector.value).eql('');

  }
}

export const careerGoalsPage = new CareerGoalsPage();
