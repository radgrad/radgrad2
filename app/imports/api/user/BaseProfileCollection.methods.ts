import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Users } from './UserCollection';

export const updateLastVisited = new ValidatedMethod({
  name: 'BaseProfile.updateLastVisited',
  validate: null,
  mixins: [CallPromiseMixin],
  run({ pageID }) {
    if (Meteor.isServer) {
      if (!this.userId) {
        throw new Meteor.Error('unauthorized', 'You must be logged in to update last visited time.');
      }
      const profileCollection = Users.getProfileCollection(this.userId);
      profileCollection.updateLastVisitedEntry(this.userId, pageID);
    }
  },
});
