import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Factoids } from '../../api/factoid/FactoidCollection';
import { RadGrad } from '../../api/radgrad/RadGrad';
import { ROLE } from '../../api/role/Role';
import { Users } from '../../api/user/UserCollection';

// Publish all RadGrad collections.
RadGrad.collections.forEach((collection) => {
  // console.log(`Publishing ${collection.getCollectionName()}`);
  collection.publish();
});

// User collection is not part of RadGrad collections, so publish it separately.
Users.publish();

// Factoid collection is not part of RadGrad collections, we don't want to dump them or restore them.
Factoids.publish();

// User Status
Meteor.publish('userStatus', function userStatus() {
  if (!this.userId) { // https://github.com/meteor/meteor/issues/9619
    return this.ready();
  }
  if (Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
    return Meteor.users.find({ 'status.online': true });
  }
  return [];
});

// Roles
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
