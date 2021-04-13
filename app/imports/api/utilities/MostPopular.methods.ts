import _ from 'lodash';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Courses } from '../course/CourseCollection';
import { Interests } from '../interest/InterestCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { ProfileCareerGoals } from '../user/profile-entries/ProfileCareerGoalCollection';
import { ProfileCourses } from '../user/profile-entries/ProfileCourseCollection';
import { ProfileInterests } from '../user/profile-entries/ProfileInterestCollection';
import { ProfileOpportunities } from '../user/profile-entries/ProfileOpportunityCollection';

export interface MostPopularData {
  interests?: Array<[string, number]>;
  careergoals?: Array<[string, number]>;
  courses?: Array<[string, number]>;
  opportunities?: Array<[string, number]>;
}

const calculatePopular = (cursor, entityIDName, collection) => {
  const resultsObject = {};
  cursor.forEach((document) => {
    const currValue = resultsObject[document[entityIDName]];
    resultsObject[document[entityIDName]] = _.isUndefined(currValue) ? 0 : currValue + 1;
  });
  let pairs: Array<[string, number]> = _.toPairs(resultsObject);
  pairs.sort((pair1, pair2) => pair2[1] - pair1[1]);
  pairs = pairs.map(pair => [collection.findSlugByID(pair[0]), pair[1]]);
  return pairs;
};

/**
 * Calculates and returns the number of users associated with Interests, Career Goals, Courses, and Opportunities.
 */
export const getMostPopular = new ValidatedMethod({
  name: 'Entities.getMostPopular',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    const data: MostPopularData = {};
    if (Meteor.isServer) {
      data.interests = calculatePopular(ProfileInterests.find(), 'interestID', Interests);
      data.careergoals = calculatePopular(ProfileCareerGoals.find(), 'careerGoalID', CareerGoals);
      data.courses = calculatePopular(ProfileCourses.find(), 'courseID', Courses);
      data.opportunities = calculatePopular(ProfileOpportunities.find(), 'opportunityID', Opportunities);
    }
    return data;
  },
});
