import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../role/Role';
import { remainingRequirements } from './RemainingRequirements';

export const getRemainingRequirementsMethod = new ValidatedMethod({
  name: 'RemaniningRequirements.getRemainingRequirements',
  validate: null,
  run(student) {
    this.unblock();
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to get remaining requirements.', Error().stack);
    } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN])) {
      throw new Meteor.Error('unauthorized', 'You must be an Admin to send get remaining requirements.', Error().stack);
    }
    remainingRequirements(student);
  },
});
