import faker from 'faker';
import { PageInterestInfo } from '../../typings/radgrad';
import { PageInterestsDailySnapshots } from './PageInterestsDailySnapshotCollection';

/**
 * Creates a PageInterestInfo object of a unique slug and views
 * @param maxViews (inclusive) the maximum number of views randomly generated
 */
const makeSamplePageInterestInfo = (maxViews): PageInterestInfo => {
  const name = faker.lorem.slug();
  const views = faker.random.number(maxViews);
  return { name, views };
};

/**
 * Creates an array of PageInterestInfo
 * @param numItems the number of items in the array to create
 */
export const makeSamplePageInterestInfoArray = (numItems: number): PageInterestInfo[] => {
  const pageInterestInfoArray: PageInterestInfo[] = [];
  for (let i = 0; i < numItems; i++) {
    const maxViews = faker.random.number(1000);
    const pageInterestInfo = makeSamplePageInterestInfo(maxViews);
    pageInterestInfoArray.push(pageInterestInfo);
  }
  return pageInterestInfoArray;
};

export const makeSamplePageInterestsDailySnapshot = () => {
  const numItems = 5;
  const careerGoals: PageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
  const courses: PageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
  const interests: PageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
  const opportunities: PageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
  return PageInterestsDailySnapshots.define({ careerGoals, courses, interests, opportunities });
};
