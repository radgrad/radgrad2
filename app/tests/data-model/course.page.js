import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../../imports/ui/utilities/ComponentIDs';

class CoursePage {
  async addCourse(t) {
    const slugSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_SLUG}`);
    const nameSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_NAME}`);
    const shortNameSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_SHORT_NAME}`);
    const creditHoursSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_CREDIT_HOURS}`);
    const numSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_NUM}`);
    const descriptionSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_DESCRIPTION}`);
    const pictureSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_PICTURE}`);
    const syllabusSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_SYLLABUS}`);
    const interestsSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_INTERESTS}`);
    const interestsOption = interestsSelect.find('div span');
    const submitSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_SUBMIT}`);
    const slug = 'ics_4321';
    const name = 'New course';
    const shortName = 'New';
    const num = 'ICS 4321';
    const description = "The new course' description.";
    const picture = 'https://mywebsite.com/picture';
    const syllabus = `https://dept.ics.edu/${slug}/syllabus`;
    // const coreq = 'ics_211';
    // const coreqsSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_COREQUISITES}`);
    // const prereq = 'ics_111';
    // const prereqsSelect = new Selector(`#${COMPONENTIDS.DATA_MODEL_PREREQUISITES}`);
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
    // give things time to propagate
    await t.wait(1000);
    // check the reset form
    await t
      .expect(slugSelect.value).eql('');
  }
}

export const coursePage = new CoursePage();
