import faker from 'faker';
import { makeSampleUser } from '../../../../app/imports/api/user/SampleUsers';
import { Users } from '../../../../app/imports/api/user/UserCollection';
import { PageInterests } from './PageInterestCollection';

export const makeSamplePageInterest = (): string => {
  const userID = makeSampleUser();
  const username = Users.getProfile(userID).username;
  const category = faker.lorem.word();
  const name = faker.lorem.slug();
  return PageInterests.define({ username, category, name });
};
