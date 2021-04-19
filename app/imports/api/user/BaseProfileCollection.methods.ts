import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { ROLE } from '../role/Role';
import { Users } from './UserCollection';
import { StudentProfileUpdate } from '../../typings/radgrad';
import { updateMethod } from '../base/BaseCollection.methods';
import { EXPLORER_TYPE } from '../../ui/layouts/utilities/route-constants';

export const updateLastVisited = new ValidatedMethod({
  name: 'BaseProfile.updateLastVisited',
  validate: null,
  run({ pageID }) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update last visited time.');
    }
    const profileCollection = Users.getProfileCollection(this.userId);
    profileCollection.updateLastVisitedEntry(this.userId, pageID);
  },
});

/**
 * The updateLastVisited ValidatedMethod.
 * @memberOf api/student
 */
export const updateLastVisitedMethod = new ValidatedMethod({
  name: 'BaseProfile.updateLastVisitedMethod',
  validate: null,
  run({ collectionName, lastVisitedTime, type } : { collectionName: string; lastVisitedTime: string; type: string; }) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to update last visited time.');
    }
    const profile = Users.getProfile(this.userId);
    if (!_.includes([ROLE.STUDENT], profile.role)) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as STUDENT to update last visited time.');
    }
    const updateData: StudentProfileUpdate = {};
    let needToUpdate = false;
    updateData.id = profile._id;
    switch (type) {
      case EXPLORER_TYPE.CAREERGOALS:
        if (lastVisitedTime !== profile.lastVisitedCareerGoals) {
          updateData.lastVisitedCareerGoals = lastVisitedTime;
          needToUpdate = true;
        }
        break;
      case EXPLORER_TYPE.COURSES:
        if (lastVisitedTime !== profile.lastVisitedCourses) {
          updateData.lastVisitedCourses = lastVisitedTime;
          needToUpdate = true;
        }
        break;
      case EXPLORER_TYPE.INTERESTS:
        if (lastVisitedTime !== profile.lastVisitedInterests) {
          updateData.lastVisitedInterests = lastVisitedTime;
          needToUpdate = true;
        }
        break;
      default:
        console.error(`Bad explorer type: ${type}`);
        break;
    }
    if (needToUpdate) {
      updateMethod.call({ collectionName, updateData }, (error, result) => {
        if (error) {
          console.error('Error updating StudentProfile', collectionName, updateData, error);
        }
      });
    }
  },
});
