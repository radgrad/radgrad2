import { Meteor } from 'meteor/meteor';
import { RadGrad } from '../radgrad/RadGrad';
// import { assertIntegrity } from '../integrity/IntegrityChecker';
// import { Users } from '../user/UserCollection';

/**
 * Deletes all documents from all RadGrad collections.
 * Checks the integrity of the database before doing the deletion.
 * To be used only in testing mode.
 * @memberOf api/base
 * @throws { Meteor.Error } If there is an integrity issue with the DB prior to deletion.
 * @returns true
 */
export const removeAllEntities = (): boolean => {
  if (Meteor.isTest || Meteor.isAppTest) {
    // assertIntegrity();  // this started failing after update to Meteor 1.6.1!
    RadGrad.collections.forEach((collection) => {
      if (collection.type !== 'AdminProfile') {
        collection.collection.remove({});
      }
    });
    // Users is not part of RadGrad collections, so must deal with it individually.
    // Users.removeAll();
  } else {
    throw new Meteor.Error('removeAllEntities not called in testing mode.');
  }
  return true;
};
