import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../../imports/ui/utilities/ComponentIDs';

class CoursePage {
  async addCourse(t) {
    const slug = 'ics_4321';
    const slugSelect = Selector(`#${COMPONENTIDS.DATA_MODEL_SLUG}`);
    const name = 'New course';
    const nameSelect = Selector(`#${COMPONENTIDS.DATA_MODEL_NAME}`);
    const shortName = 'New';
    const shortNameSelect = Selector(`#${COMPONENTIDS.DATA_MODEL_SHORT_NAME}`);
    const creditHoursSelect = Selector(`#${COMPONENTIDS.DATA_MODEL_CREDIT_HOURS}`);
    const num = 'ICS 4321';
    const numSelect = Selector(`#${COMPONENTIDS.DATA_MODEL_NUM}`);
    const description = "The new course' description.";
    const descriptionSelect = Selector(`#${COMPONENTIDS.DATA_MODEL_DESCRIPTION}`);
    const picture = 'https://mywebsite.com/picture';
    const pictureSelect = Selector(`#${COMPONENTIDS.DATA_MODEL_PICTURE}`);
    const syllabus = `https://dept.ics.edu/${slug}/syllabus`;
    const syllabusSelect = Selector(`#${COMPONENTIDS.DATA_MODEL_SYLLABUS}`);
    const interestsSelect = Selector(`#${COMPONENTIDS.DATA_MODEL_INTERESTS}`);
    const interestsOption = interestsSelect.find('option');
    // const coreq = 'ics_211';
    // const coreqsSelect = Selector(`#${COMPONENTIDS.DATA_MODEL_COREQUISITES}`);
    // const prereq = 'ics_111';
    // const prereqsSelect = Selector(`#${COMPONENTIDS.DATA_MODEL_PREREQUISITES}`);
    const submitSelect = Selector(`#${COMPONENTIDS.DATA_MODEL_SUBMIT}`);
    // fill the form
    await t
      .click(slugSelect)
      .typeText(slugSelect, slug)
      .expect(slugSelect.value).eql(slug);
    await t
      .typeText(nameSelect, name)
      .expect(nameSelect.value).eql(name);
    await t
      .typeText(shortNameSelect, shortName)
      .expect(shortNameSelect.value).eql(shortName);
    await t
      .selectText(creditHoursSelect)
      .typeText(creditHoursSelect, '6')
      .expect(creditHoursSelect.value).eql('6');
    await t
      .typeText(numSelect, num)
      .expect(numSelect.value).eql(num);
    await t
      .typeText(descriptionSelect, description)
      .expect(descriptionSelect.value).eql(description);
    await t
      .typeText(pictureSelect, picture)
      .expect(pictureSelect.value).eql(picture);
    await t
      .typeText(syllabusSelect, syllabus)
      .expect(syllabusSelect.value).eql(syllabus);
    await t
      .click(interestsSelect)
      .click(interestsOption.withText('.NET'))
      .click(interestsOption.withText('C#'));
    // submit the form
    await t.click(submitSelect);
    // check the reset form
    await t
      .expect(slugSelect.value).eql('');
  }
}

export const coursePage = new CoursePage();
