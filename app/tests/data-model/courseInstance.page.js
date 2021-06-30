import {
  courseOption,
  courseSelector,
  creditHoursSelector, errorFieldSelector, gradeOption, gradeSelector,
  studentNames,
  studentOption,
  studentSelector, submitSelector,
  termOption, termSelector,
} from './selectors';

class CourseInstancePage {
  async addCourseInstance(t) {
    const currentTerm = 'Summer 2021'; // TODO update this when it changes.
    const academicTermName = 'Fall 2022';
    await t
      .click(termSelector)
      .click(termOption.withText(academicTermName))
      .expect(termSelector.value).eql(academicTermName);
    const courseName = 'ICS 499: Independent Study';
    await t
      .click(courseSelector)
      .click(courseOption.withText(courseName))
      .expect(courseSelector.value).eql(courseName);
    const studentName = studentNames.betty;
    await t
      .click(studentSelector)
      .click(studentOption.withText(studentName))
      .expect(studentSelector.value).eql(studentName);
    const creditHours = '4';
    await t
      .click(creditHoursSelector)
      .typeText(creditHoursSelector, creditHours)
      .expect(creditHoursSelector.value).eql(creditHours);
    const grade = 'B+';
    await t
      .click(gradeSelector)
      .click(gradeOption.withText(grade))
      .expect(gradeSelector.value).eql(grade);
    await t.click(submitSelector);
    await t.expect(errorFieldSelector.exists).notOk;
    // give things time to propagate
    await t.wait(500);
    await t
      .expect(termSelector.value).eql(currentTerm)
      .expect(studentSelector.value).eql(studentNames.abi);
  }
}

export const courseInstancePage = new CourseInstancePage();
