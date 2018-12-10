import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicTerms } from './AcademicTermCollection';
import { RadGradSettings } from '../radgrad/RadGradSettingsCollection';

/**
 * Defines default semesters from 2014 till 2020.
 * @memberOf api/semester
 */
export function defineAcademicTerms() {
  if (AcademicTerms.find().count() === 0) {
    const settingsDoc = RadGradSettings.findOne({});
    if (settingsDoc.quarterSystem) {
      AcademicTerms.define({ term: AcademicTerms.FALL, year: 2017 });
      AcademicTerms.define({ term: AcademicTerms.WINTER, year: 2018 });
      AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2018 });
      AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2018 });
      AcademicTerms.define({ term: AcademicTerms.FALL, year: 2018 });
      AcademicTerms.define({ term: AcademicTerms.WINTER, year: 2019 });
      AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2019 });
      AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2019 });
      AcademicTerms.define({ term: AcademicTerms.FALL, year: 2019 });
      AcademicTerms.define({ term: AcademicTerms.WINTER, year: 2020 });
      AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2020 });
      AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2020 });
      AcademicTerms.define({ term: AcademicTerms.FALL, year: 2020 });
      AcademicTerms.define({ term: AcademicTerms.WINTER, year: 2021 });
      AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2021 });
      AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2021 });
      AcademicTerms.define({ term: AcademicTerms.FALL, year: 2021 });
      AcademicTerms.define({ term: AcademicTerms.WINTER, year: 2022 });
      AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2022 });
      AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2022 });
      AcademicTerms.define({ term: AcademicTerms.FALL, year: 2022 });
      AcademicTerms.define({ term: AcademicTerms.WINTER, year: 2023 });
      AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2023 });
      AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2023 });
    } else {
      AcademicTerms.define({ term: AcademicTerms.FALL, year: 2017 });
      AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2018 });
      AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2018 });
      AcademicTerms.define({ term: AcademicTerms.FALL, year: 2018 });
      AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2019 });
      AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2019 });
      AcademicTerms.define({ term: AcademicTerms.FALL, year: 2019 });
      AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2020 });
      AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2020 });
      AcademicTerms.define({ term: AcademicTerms.FALL, year: 2020 });
      AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2021 });
      AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2021 });
      AcademicTerms.define({ term: AcademicTerms.FALL, year: 2021 });
      AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2022 });
      AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2022 });
      AcademicTerms.define({ term: AcademicTerms.FALL, year: 2022 });
      AcademicTerms.define({ term: AcademicTerms.SPRING, year: 2023 });
      AcademicTerms.define({ term: AcademicTerms.SUMMER, year: 2023 });
    }
  }
}

/**
 * Returns the next AcademicTerm document given an AcademicTerm document.
 * @param termDoc the AcademicTerm doc.
 * @returns The next AcademicTerm doc.
 * @memberOf api/semester
 */
export function nextAcademicTerm(termDoc) {
  const settingsDoc = RadGradSettings.findOne({});
  const currentTerm = termDoc.term;
  const currentYear = termDoc.year;
  let term;
  let year = currentYear;
  if (currentTerm === AcademicTerms.FALL) {
    if (settingsDoc.quarterSystem) {
      term = AcademicTerms.WINTER;
    } else {
      term = AcademicTerms.SPRING;
    }
    year += 1;
  } else if (currentTerm === AcademicTerms.WINTER) {
    term = AcademicTerms.SPRING;
  } else if (currentTerm === AcademicTerms.SPRING) {
    term = AcademicTerms.SUMMER;
  } else {
    term = AcademicTerms.FALL;
  }
  return AcademicTerms.findDoc(AcademicTerms.define({ term, year }));
}

/**
 * Returns the next Fall, Winter or Spring academic term doc. Skips over Summer academic terms.
 * @param term the academic term doc.
 * @returns The next academic term doc (excluding summer).
 * @memberOf api/semester
 */
export function nextNonSummerTerm(term) {
  let next: { term: string } = nextAcademicTerm(term);
  if (next.term === AcademicTerms.SUMMER) {
    next = nextAcademicTerm(next);
  }
  return next;
}

/**
 * Returns an array of the upcoming semesters.
 * @return {array} of the upcoming semesters.
 * @memberOf api/semester
 */
export function upComingTerms() {
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const nine = currentTerm.termNumber + 10;
  return _.sortBy(AcademicTerms.find({
    termNumber: {
      $gt: currentTerm.termNumber,
      $lt: nine,
    },
  }).fetch(), (sem) => sem.termNumber);
}
