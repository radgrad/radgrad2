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
        throw new Meteor.Error('unauthorized', 'You must be logged in to calculate Levels.');
      } else if (!Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
        throw new Meteor.Error('unauthorized', 'You must be logged in as ADMIN or ADVISOR to calculate Levels.');
      }
      const count = updateAllStudentLevels(this.userId);
      return `Updated ${count} students' levels.`;
    }
    return null;
  },
});
