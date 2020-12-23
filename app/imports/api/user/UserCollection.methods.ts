import { Meteor } from 'meteor/meteor';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import _ from 'lodash';
import { ROLE } from '../role/Role';
import { StudentProfiles } from './StudentProfileCollection';
import { Users } from './UserCollection';

export const generateStudentEmailsMethod = new ValidatedMethod({
  name: 'User.studentEmails',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get student emails.');
    } else {
      const profile = Users.getProfile(this.userId);
      if (!_.includes([ROLE.ADMIN, ROLE.ADVISOR], profile.role)) {
        throw new Meteor.Error('unauthorized', 'You must be an admin or advisor to get student emails.');
      }
    }
    // Don't generate unless on Server side.
    if (Meteor.isServer) {
      const profiles = StudentProfiles.findNonRetired({ isAlumni: false });
      const students = _.map(profiles, (student) => student.username);
      return { students };
    }
    return null;
  },
});
