import faker from 'faker';
import { AcademicTerms } from './AcademicTermCollection';

export const getRandomTerm = () => {
  const index = faker.random.number({ max: AcademicTerms.terms.length - 1 });
  return AcademicTerms.terms[index];
};

export const makeSampleAcademicTerm = () => {
  const term = getRandomTerm();
  const year = faker.random.number({ min: 2017, max: 2027 });
  return AcademicTerms.define({ term, year });
};
