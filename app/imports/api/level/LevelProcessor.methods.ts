import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { updateStudentLevel, updateAllStudentLevels, defaultCalcLevel } from './LevelProcessor';
import { ROLE } from '../role/Role';
import { RadGrad } from '../radgrad/RadGrad';
import { Users } from '../user/UserCollection';

/**
 * The LevelProcessor calcLevel ValidatedMethod.
 * @memberOf api/level
 */
export const calcLevelMethod = new ValidatedMethod({
  name: 'LevelProcessor.calcLevel',
  validate: null,
  run({ studentID }) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to calculate Levels.');
    }
    const profile = Users.getProfile(this.userId);
    if (!_.includes([ROLE.ADMIN, ROLE.ADVISOR], profile.role)) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as ADMIN or ADVISOR to calculate Levels.');
    }
    if (RadGrad.calcLevel) {
      return RadGrad.calcLevel(studentID);
    }
    return defaultCalcLevel(studentID);
  },
});

/**
 * The LevelProcessor updateLevel ValidatedMethod.
 * @memberOf api/level
 */
export const updateLevelMethod = new ValidatedMethod({
  name: 'LevelProcessor.updateLevel',
  validate: null,
  run({ studentID }) {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to calculate Levels.');
    }
    const profile = Users.getProfile(this.userId);
    if (!_.includes([ROLE.ADMIN, ROLE.ADVISOR], profile.role)) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as ADMIN or ADVISOR to calculate Levels.');
    }
    updateStudentLevel(this.userId, studentID);
  },
});

/**
 * The LevelProcessor update all students' level validated method.
 * @memberOf api/level
 */
export const updateAllStudentLevelsMethod = new ValidatedMethod({
  name: 'LevelProcessor.updateAllStudentLevels',
  validate: null,
  run() {
    if (!this.userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in to calculate Levels.');
    }
    const profile = Users.getProfile(this.userId);
    if (!_.includes([ROLE.ADMIN, ROLE.ADVISOR], profile.role)) {
      throw new Meteor.Error('unauthorized', 'You must be logged in as ADMIN or ADVISOR to calculate Levels.');
    }
    const count = updateAllStudentLevels(this.userId);
    return `Updated ${count} students' levels.`;
  },
});
