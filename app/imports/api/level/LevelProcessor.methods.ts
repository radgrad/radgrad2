import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { updateStudentLevel, updateAllStudentLevels, defaultCalcLevel } from './LevelProcessor';
import { ROLE } from '../role/Role';
import { RadGrad } from '../radgrad/RadGrad';

/**
 * The LevelProcessor calcLevel ValidatedMethod.
 * @memberOf api/level
 */
export const calcLevelMethod = new ValidatedMethod({
  name: 'LevelProcessor.calcLevel',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ studentID }) {
    if (Meteor.isServer) {
      if (!this.userId) {
        throw new Meteor.Error('unauthorized', 'You must be logged in to calculate Levels.');
      } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be logged in as ADMIN or ADVISOR to calculate Levels.');
      }
      if (RadGrad.calcLevel) {
        return RadGrad.calcLevel(studentID);
      }
      return defaultCalcLevel(studentID);
    }
    return null;
  },
});

/**
 * The LevelProcessor updateLevel ValidatedMethod.
 * @memberOf api/level
 */
export const updateLevelMethod = new ValidatedMethod({
  name: 'LevelProcessor.updateLevel',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ studentID }) {
    if (Meteor.isServer) {
      if (!this.userId) {
        throw new Meteor.Error('unauthorized', 'You must be logged in to calculate Levels.');
      } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be logged in as ADMIN or ADVISOR to calculate Levels.');
      }
      updateStudentLevel(studentID);
    }
  },
});

/**
 * The LevelProcessor update all students' level validated method.
 * @memberOf api/level
 */
export const updateAllStudentLevelsMethod = new ValidatedMethod({
  name: 'LevelProcessor.updateAllStudentLevels',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (Meteor.isServer) {
      if (!this.userId) {
        throw new Meteor.Error('unauthorized', 'You must be logged in to update Levels.');
      } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be an Admin or Advisor to update Levels.');
      }
      const count = updateAllStudentLevels();
      return `Updated ${count} student levels.`;
    }
    return null;
  },
});

export const updateMyLevelMethod = new ValidatedMethod({
  name: 'LevelProcessor.updateMyLevel',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (Meteor.isServer) {
      if (!this.userId) {
        throw new Meteor.Error('unauthorized', 'You must be logged in to update your Level.');
      } else if (!Roles.userIsInRole(this.userId, [ROLE.STUDENT])) {
        throw new Meteor.Error('unauthorized', 'You must be a student to update your own Level.');
      }
      return updateStudentLevel(this.userId);
    }
    return null;
  },
});
