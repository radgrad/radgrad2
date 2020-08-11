import faker from 'faker';
import { AcademicTerms } from './AcademicTermCollection';
import { Slugs } from '../slug/SlugCollection';

/**
 * Returns a random term.
 * @return {string} a random academic term.
 * @memberOf api/academic-term
 */
export const getRandomTerm = () => {
  const index = faker.random.number({ max: AcademicTerms.terms.length - 1 });
  return AcademicTerms.terms[index];
};

export const makeSampleAcademicTerm = () => {
  const term = getRandomTerm();
  const year = faker.random.number({ min: 2017, max: 2027 });
  return AcademicTerms.define({ term, year });
};

export const makeSampleAcademicTermArray = (numTerms = 2) => {
  const retVal = [];
  for (let i = 0; i < numTerms; i++) {
    retVal.push(makeSampleAcademicTerm());
  }
  return retVal;
};

export const makeSampleAcademicTermSlug = () => {
  const termID = makeSampleAcademicTerm();
  return Slugs.getNameFromID(AcademicTerms.findDoc(termID).slugID);
};
