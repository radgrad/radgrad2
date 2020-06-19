import faker from 'faker';
import { IPageInterestInfo } from '../../typings/radgrad';
import { PageInterestsDailySnapshots } from './PageInterestsDailySnapshotCollection';

/**
 * Creates a PageInterestInfo object of a unique slug and views
 * @param maxViews (inclusive) the maximum number of views randomly generated
 */
const makeSamplePageInterestInfo = (maxViews): IPageInterestInfo => {
  const name = faker.lorem.slug();
  const views = faker.random.number(maxViews);
  return { name, views };
};

/**
 * Creates an array of PageInterestInfo
 * @param numItems the number of items in the array to create
 */
export const makeSamplePageInterestInfoArray = (numItems: number): IPageInterestInfo[] => {
  const pageInterestInfoArray: IPageInterestInfo[] = [];
  for (let i = 0; i < numItems; i++) {
    const maxViews = faker.random.number(1000);
    const pageInterestInfo = makeSamplePageInterestInfo(maxViews);
    pageInterestInfoArray.push(pageInterestInfo);
  }
  return pageInterestInfoArray;
};

export const makeSamplePageInterestsDailySnapshot = () => {
  const numItems = 5;
  const careerGoals: IPageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
  const courses: IPageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
  const interests: IPageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
  const opportunities: IPageInterestInfo[] = makeSamplePageInterestInfoArray(numItems);
  return PageInterestsDailySnapshots.define({ careerGoals, courses, interests, opportunities });
};
