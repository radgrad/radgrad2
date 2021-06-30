import {
  studentSelector,
  studentOption,
  studentNames,
  yearSelector,
  submitSelector,
  errorFieldSelector,
} from './selectors';

class AcademicYearPage {
  async addAcademicYearInstance(t) {
    const year = 2021; // will need to update this.
    const nextYear = `${year + 1}`;
    const student = studentNames.abi;
    await t
      .click(studentSelector)
      .click(studentOption.withText(student))
      .expect(studentSelector.value).eql(student);
    await t.selectText(yearSelector)
      .typeText(yearSelector, nextYear)
      .expect(yearSelector.value).eql(nextYear);
    // Submit the data.
    await t.click(submitSelector);
    await t.expect(errorFieldSelector.exists).notOk;
    // give things time to propagate
    await t.wait(1000);
    // Check that the form reset.
    await t
      .expect(yearSelector.value).eql(`${year}`)
      .expect(studentSelector.value).eql('');
  }
}

export const academicYearPage = new AcademicYearPage();
