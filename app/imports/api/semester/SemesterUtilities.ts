import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicTerms } from './AcademicTermCollection';

/**
 * Defines default semesters from 2014 till 2020.
 * @memberOf api/semester
 */
export function defineSemesters() {
  if (AcademicTerms.find().count() === 0) {
    AcademicTerms.define({ term: AcademicTerms.FALL, year: 2014 });
    AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2015 });
    AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2015 });
    AcademicTerms.define({ term: AcademicTerms.FALL, year: 2015 });
    AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2016 });
    AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2016 });
    AcademicTerms.define({ term: AcademicTerms.FALL, year: 2016 });
    AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2017 });
    AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2017 });
    AcademicTerms.define({ term: AcademicTerms.FALL, year: 2017 });
    AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2018 });
    AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2018 });
    AcademicTerms.define({ term: AcademicTerms.FALL, year: 2018 });
    AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2019 });
    AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2019 });
    AcademicTerms.define({ term: AcademicTerms.FALL, year: 2019 });
    AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2020 });
    AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2020 });
  }
}

/**
 * Returns the next semester document given a semester document.
 * @param semesterDoc the semester doc.
 * @returns The next semester doc.
 * @memberOf api/semester
 */
export function nextSemester(semesterDoc) {
  const currentTerm = semesterDoc.term;
  const currentYear = semesterDoc.year;
  let term;
  let year = currentYear;
  if (currentTerm === AcademicTerms.FALL) {
    term = AcademicTerms.SPRING;
    year += 1;
  } else
    if (currentTerm === AcademicTerms.SPRING) {
      term = AcademicTerms.SUMMER;
    } else {
      term = AcademicTerms.FALL;
    }
  return AcademicTerms.findDoc(AcademicTerms.define({ term, year }));
}

/**
 * Returns the next Fall or Spring semester doc. Skips over Summer semesters.
 * @param semester the semester doc.
 * @returns The next semester doc (excluding summer).
 * @memberOf api/semester
 */
export function nextFallSpringSemester(semester) {
  let next: { term: string } = nextSemester(semester);
  if (next.term === AcademicTerms.SUMMER) {
    next = nextSemester(next);
  }
  return next;
}

/**
 * Returns an array of the upcoming semesters.
 * @return {array} of the upcoming semesters.
 * @memberOf api/semester
 */
export function upComingSemesters() {
  const currentSemester = AcademicTerms.getCurrentSemesterDoc();
  const nine = currentSemester.semesterNumber + 10;
  return _.sortBy(AcademicTerms.find({ semesterNumber: { $gt: currentSemester.semesterNumber, $lt: nine } }).fetch(), (sem) => sem.semesterNumber);
}
