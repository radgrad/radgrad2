import _ from 'lodash';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import { defineMethod } from '../base/BaseCollection.methods';
import { CareerGoals } from '../career/CareerGoalCollection';
import { FavoriteCareerGoals } from '../favorite/FavoriteCareerGoalCollection';
import { FavoriteInterests } from '../favorite/FavoriteInterestCollection';
import { Users } from '../user/UserCollection';

export const careerGoalInterestConversionMethod = new ValidatedMethod({
  name: 'Interests.convertCareerGoalInterests',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    const users = Users.findProfiles({}, {});
    // console.log(users);
    const userIDs = users.map((u) => u.userID);
    userIDs.forEach((userID) => {
      const favInterests = FavoriteInterests.findNonRetired({ userID });
      const share = favInterests.length > 0 ? favInterests[0].share : false;
      const interestIDs = favInterests.map((fav) => fav.interestID);
      const favCareerGoals = FavoriteCareerGoals.findNonRetired({ userID });
      let careerGoalInterests = [];
      favCareerGoals.forEach((fav) => {
        const careerGoal = CareerGoals.findDoc(fav.careerGoalID);
        // console.log(careerGoal, careerGoal.interestIDs);
        careerGoalInterests = _.union(careerGoalInterests, careerGoal.interestIDs);
      });
      // console.log(careerGoalInterests);
      const missingInterestIDs = _.difference(_.uniq(careerGoalInterests), interestIDs);
      missingInterestIDs.forEach((interestID) => {
        const collectionName = FavoriteInterests.getCollectionName();
        const definitionData = {
          username: userID,
          interest: interestID,
          share,
        };
        defineMethod.call({ collectionName, definitionData }, (error) => {
          if (error) {
            console.error(`Failed to define interest ${userID}, ${interestID}`, error);
          }
        });
      });
      // console.log(missingInterestIDs);
    });
  },
});
