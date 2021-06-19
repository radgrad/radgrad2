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
    const coreq = 'ics_211';
    const coreqsSelect = Selector(`#${COMPONENTIDS.DATA_MODEL_COREQUISITES}`);
    const prereq = 'ics_111';
    const prereqsSelect = Selector(`#${COMPONENTIDS.DATA_MODEL_PREREQUISITES}`);
    // fill the form
    await t
      .typeText(slugSelect, slug)
      .typeText(nameSelect, name)
      .typeText(shortNameSelect, shortName)
      .selectText(creditHoursSelect)
      .typeText(creditHoursSelect, '6')
      .typeText(numSelect, num)
      .typeText(descriptionSelect, description)
      .typeText(pictureSelect, picture)
      .typeText(syllabusSelect, syllabus)
      .click(interestsSelect)
      .click(interestsOption.withText('.NET'))
      .click(interestsOption.withText('C#'))
      .typeText(coreqsSelect, coreq)
      .typeText(prereqsSelect, prereq);
    // check the form
    await t
      .expect(slugSelect.value).eql(slug)
      .expect(nameSelect.value).eql(name)
      .expect(shortNameSelect.value).eql(shortName)
      .expect(creditHoursSelect.value).eql('6')
      .expect(numSelect.value).eql(num)
      .expect(descriptionSelect.value).eql(description)
      .expect(pictureSelect.value).eql(picture)
      .expect(syllabusSelect.value).eql(syllabus)
      .expect(coreqsSelect.value).eql(coreq)
      .expect(prereqsSelect.value).eql(prereq)
      .expect(interestsSelect.value).eql(['.NET', 'C#']);
  }
}

export const coursePage = new CoursePage();
