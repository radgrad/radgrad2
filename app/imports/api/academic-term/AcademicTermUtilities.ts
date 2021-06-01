import _ from 'lodash';
import moment from 'moment';
import { AcademicTerm } from '../../typings/radgrad';
import { AcademicTerms } from './AcademicTermCollection';
import { RadGradProperties } from '../radgrad/RadGradProperties';

/**
 * Defines the academic terms for the given year.
 * @param {number} year the year.
 */
const defineAcademicTermsForYear = (year: number): void => {
  // console.log(`Defining terms for ${year}`);
  AcademicTerms.define({ term: AcademicTerms.SPRING, year });
  AcademicTerms.define({ term: AcademicTerms.SUMMER, year });
  AcademicTerms.define({ term: AcademicTerms.FALL, year });
  if (RadGradProperties.getQuarterSystem()) {
    AcademicTerms.define({ term: AcademicTerms.WINTER, year });
  }
};

/**
 * Defines default academicTerms for last year plus 4 more years.
 * @memberOf api/academic-term
 */
export const defineAcademicTerms = (): void => {
  let year = moment().year() - 1;
  for (let i = 0; i < 5; i++) {
    defineAcademicTermsForYear(year);
    year++;
  }
};

/**
 * Ensures that there are AcademicTerms for the next 4 years.
 */
export const ensureFutureAcademicTerms = (): void => {
  let year = moment().year();
  for (let i = 0; i < 4; i++) {
    defineAcademicTermsForYear(year);
    year++;
  }
};

/**
 * Returns the next AcademicTerm document given an AcademicTerm document.
 * @param termDoc the AcademicTerm doc.
 * @returns The next AcademicTerm doc.
 * @memberOf api/academic-term
 */
export const nextAcademicTerm = (termDoc: AcademicTerm): AcademicTerm => {
  const currentTerm = termDoc.term;
  const currentYear = termDoc.year;
  let term;
  let year = currentYear;
  if (currentTerm === AcademicTerms.FALL) {
    if (RadGradProperties.getQuarterSystem()) {
      term = AcademicTerms.WINTER;
    } else {
      term = AcademicTerms.SPRING;
      year += 1;
    }
  } else if (currentTerm === AcademicTerms.WINTER) {
    term = AcademicTerms.SPRING;
  } else if (currentTerm === AcademicTerms.SPRING) {
    term = AcademicTerms.SUMMER;
  } else {
    term = AcademicTerms.FALL;
  }
  return AcademicTerms.findDoc(AcademicTerms.define({ term, year }));
};

/**
 * Returns the next Fall, Winter or Spring academic term doc. Skips over Summer academic terms.
 * @param term the academic term doc.
 * @returns The next academic term doc (excluding summer).
 * @memberOf api/academic-term
 */
export const nextNonSummerTerm = (term: AcademicTerm): AcademicTerm => {
  let next: AcademicTerm = nextAcademicTerm(term);
  if (next.term === AcademicTerms.SUMMER) {
    next = nextAcademicTerm(next);
  }
  return next;
};

/**
 * Returns an array of the upcoming academicTerms.
 * @return {array} of the upcoming academicTerms.
 * @memberOf api/academic-term
 */
export const upComingTerms = (): AcademicTerm[] => {
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const nine = currentTerm.termNumber + 10;
  return _.sortBy(AcademicTerms.find({
    termNumber: {
      $gt: currentTerm.termNumber,
      $lt: nine,
    },
  }).fetch(), (sem) => sem.termNumber);
};

export const termIDsToString = (termIDs: string[]): string[] => {
  const retVal = [];
  termIDs.forEach((id) => {
    retVal.push(AcademicTerms.toString(id));
  });
  return retVal;
};
