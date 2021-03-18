import faker from 'faker';
import moment from 'moment';
import { CareerGoals } from './CareerGoalCollection';
import { makeSampleInterest } from '../interest/SampleInterests';
import slugify, { Slugs } from '../slug/SlugCollection';

/**
 * Defines a sample CareerGoal.
 * @return {string} the id of the defined CareerGoal.
 */
export const makeSampleCareerGoal = (): string => {
  const name = faker.lorem.word();
  const slug = slugify(`career-goal-${name}-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`);
  const description = faker.lorem.paragraph();
  const interests = [makeSampleInterest()];
  return CareerGoals.define({ name, slug, description, interests });
};

/**
 * Returns an array of defined CareerGoal ids.
 * @param num the number of CareerGoals to define.
 * @return {string[]} An array of CareerGoal ids.
 */
export const makeSampleCareerGoalArray = (num = 2): string[] => {
  const retVal = [];
  for (let i = 0; i < num; i++) {
    retVal.push(makeSampleCareerGoal());
  }
  return retVal;
};

/**
 * Returns an array of defined CareerGoal slugs.
 * @param num the number of CareerGoals to define.
 * @return {string[]} An array of defined CareerGoal slugs.
 */
export const makeSampleCareerGoalSlugArray = (num = 2) => {
  const ids = makeSampleCareerGoalArray(num);
  return ids.map((id) => {
    const doc = CareerGoals.findDoc(id);
    return Slugs.getNameFromID(doc.slugID);
  });
};
