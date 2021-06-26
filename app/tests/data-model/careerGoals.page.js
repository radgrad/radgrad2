import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../../imports/ui/utilities/ComponentIDs';

class CareerGoalsPage {
  async addCareerGoal(t) {
    // console.log('inside addCareerGoal', t);
    const name = 'Quantum Software Developer';
    const nameSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_NAME}`);
    const interestsSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_INTERESTS}`);
    const interestsOption = interestsSelect.find('div span');
    const pictureSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_PICTURE}`);
    const descriptionSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_DESCRIPTION}`);
    const submitSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_SUBMIT}`);
    const interest1 = 'Quantum Computing';
    const interest2 = 'Software Engineering';
    const picture = 'https://mywebsite.com/picture';
    const description = 'The new software engineering using quantum code.';
    await t.selectText(nameSelect)
      .typeText(nameSelect, name)
      .expect(nameSelect.value).eql(name);
    await t
      .click(pictureSelect)
      .typeText(pictureSelect, picture)
      .expect(pictureSelect.value).eql(picture);
    await t
      .typeText(descriptionSelect, description)
      .expect(descriptionSelect.value).eql(description);
    await t
      .click(interestsSelect)
      .click(interestsOption.withText(interest1))
      .click(interestsOption.withText(interest2));
    await t.click(submitSelect);
    // give things time to propagate
    await t.wait(1000);
    await t
      .expect(nameSelect.value).eql('')
      .expect(pictureSelect.value).eql('')
      .expect(descriptionSelect.value).eql('');

  }
}

export const careerGoalsPage = new CareerGoalsPage();
