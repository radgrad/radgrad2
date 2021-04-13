import _ from 'lodash';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ProfileInterests } from '../user/profile-entries/ProfileInterestCollection';

export interface MostPopularData {
  interests?: Array<[string, number]>;
  careergoals?: Array<[string, number]>;
  courses?: Array<[string, number]>;
  opportunities?: Array<[string, number]>;
}

const calculatePopular = (cursor, entityIDName) => {
  const resultsObject = {};
  cursor.forEach((document) => {
    const exists = resultsObject[document[entityIDName]];
    resultsObject[document[entityIDName]] = exists ? exists + 1 : 0;
  });
  console.log('step 1', resultsObject);
  const pairs: Array<[string, number]> = _.toPairs(resultsObject);
  console.log('pairs', pairs);
  pairs.sort((pair1, pair2) => pair1[1] - pair2[1]);
  console.log('sorted pairs', pairs);
  return pairs;
};

/**
 * Meteor method used to retrieve the terms and conditions string from a file and return it to the client.
 */
export const getMostPopular = new ValidatedMethod({
  name: 'Entities.getMostPopular',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    const data: MostPopularData = {};
    if (Meteor.isServer) {
      data.interests = calculatePopular(ProfileInterests.find(), 'interestID');
    }
    return data;
  },
});
