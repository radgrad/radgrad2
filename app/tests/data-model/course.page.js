import {
  creditHoursSelector,
  descriptionSelector, errorFieldSelector, interestNames, interestsOption, interestsSelector,
  nameSelector,
  numSelector, pictureSelector,
  shortNameSelector,
  slugSelector, submitSelector, syllabusSelector,
} from './selectors';

class CoursePage {
  async addCourse(t) {
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
      .click(slugSelector)
      .typeText(slugSelector, slug)
      .expect(slugSelector.value).eql(slug);
    await t
      .typeText(nameSelector, name)
      .expect(nameSelector.value).eql(name);
    await t
      .typeText(shortNameSelector, shortName)
      .expect(shortNameSelector.value).eql(shortName);
    await t
      .selectText(creditHoursSelector)
      .typeText(creditHoursSelector, '6')
      .expect(creditHoursSelector.value).eql('6');
    await t
      .typeText(numSelector, num)
      .expect(numSelector.value).eql(num);
    await t
      .typeText(descriptionSelector, description)
      .expect(descriptionSelector.value).eql(description);
    await t
      .typeText(pictureSelector, picture)
      .expect(pictureSelector.value).eql(picture);
    await t
      .typeText(syllabusSelector, syllabus)
      .expect(syllabusSelector.value).eql(syllabus);
    await t
      .click(interestsSelector)
      .click(interestsOption.withText(interestNames.dot_net))
      .click(interestsOption.withText(interestNames.c_sharp));
    // submit the form
    await t.click(submitSelector);
    await t.expect(errorFieldSelector.exists).notOk;
    // give things time to propagate
    await t.wait(1000);
    // check the reset form
    await t
      .expect(slugSelector.value).eql('');
  }
}

export const coursePage = new CoursePage();
