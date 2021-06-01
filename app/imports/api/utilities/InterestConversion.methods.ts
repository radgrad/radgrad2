import _ from 'lodash';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { defineMethod } from '../base/BaseCollection.methods';
import { CareerGoals } from '../career/CareerGoalCollection';
import { ProfileCareerGoals } from '../user/profile-entries/ProfileCareerGoalCollection';
import { ProfileInterests } from '../user/profile-entries/ProfileInterestCollection';
import { Users } from '../user/UserCollection';

export const careerGoalInterestConversionMethod = new ValidatedMethod({
  name: 'Interests.convertCareerGoalInterests',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (Meteor.isServer) {
      const users = Users.findProfiles({}, {});
      // console.log(users);
      const userIDs = users.map((u) => u.userID);
      userIDs.forEach((userID) => {
        const favInterests = ProfileInterests.findNonRetired({ userID });
        const share = favInterests.length > 0 ? favInterests[0].share : false;
        const interestIDs = favInterests.map((fav) => fav.interestID);
        const favCareerGoals = ProfileCareerGoals.findNonRetired({ userID });
        let careerGoalInterests = [];
        favCareerGoals.forEach((fav) => {
          const careerGoal = CareerGoals.findDoc(fav.careerGoalID);
          // console.log(careerGoal, careerGoal.interestIDs);
          careerGoalInterests = _.union(careerGoalInterests, careerGoal.interestIDs);
        });
        // console.log(careerGoalInterests);
        const missingInterestIDs = _.difference(_.uniq(careerGoalInterests), interestIDs);
        missingInterestIDs.forEach((interestID) => {
          const collectionName = ProfileInterests.getCollectionName();
          const definitionData = {
            username: userID,
            interest: interestID,
            share,
          };
          defineMethod.callPromise({ collectionName, definitionData })
            .catch((error) => {
              console.error(`Failed to define interest ${userID}, ${interestID}`, error);
            });
        });
        // console.log(missingInterestIDs);a
      });
    }
  },
});
