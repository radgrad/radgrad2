import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { StudentProfiles } from '../user/StudentProfileCollection';
import { defaultCalcLevel } from './LevelProcessor';
import { removeAllEntities } from '../base/BaseUtilities';
import { RadGrad } from '../radgrad/RadGrad';
import { defineTestFixtures } from '../test/test-utilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

// TODO: Waiting for test data based upon the Personae.

if (Meteor.isServer) {
  describe('LevelProcessor Tests', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Level 1 Student', function test() {
      const profileID = StudentProfiles.define({
        username: 'levelone@hawaii.edu',
        firstName: 'Level',
        lastName: 'One',
        level: 6,
      });
      const profile = StudentProfiles.findDoc(profileID);
      let level;
      if (RadGrad.calcLevel) {
        level = RadGrad.calcLevel(profile.userID);
      } else {
        level = defaultCalcLevel(profile.userID);
      }
      expect(level)
        .to
        .equal(1);
    });

    it('Betty Level 1', function levelOne() {
      defineTestFixtures(['minimal', 'extended.courses.interests', 'betty.student']);
      const bettyProfile = StudentProfiles.findDoc({ username: 'betty@hawaii.edu' });
      expect(bettyProfile).to.exist;
      const level = defaultCalcLevel(bettyProfile.userID);
      expect(level)
        .to
        .equal(1); // no ice points
      defineTestFixtures(['betty.level1']); // one A [0, 10, 0]
      expect(defaultCalcLevel(bettyProfile.userID))
        .to
        .equal(1);
    });

    it('Betty Level 2', function levelTwo() {
      defineTestFixtures(['betty.level2']); // ice [0, 16, 0]
      const bettyProfile = StudentProfiles.findDoc({ username: 'betty@hawaii.edu' });
      expect(defaultCalcLevel(bettyProfile.userID))
        .to
        .equal(2);
    });

    it('Betty Level 3', function levelThree() {
      defineTestFixtures(['opportunities', 'extended.opportunities', 'betty.level3']); // [5, 26, 5]
      const bettyProfile = StudentProfiles.findDoc({ username: 'betty@hawaii.edu' });
      expect(defaultCalcLevel(bettyProfile.userID))
        .to
        .equal(3);
    });

    it('Betty Level 3 no picture', function noPicture() {
      defineTestFixtures(['betty.level4']); // [30, 36, 35]
      const bettyProfile = StudentProfiles.findDoc({ username: 'betty@hawaii.edu' });
      expect(defaultCalcLevel(bettyProfile.userID))
        .to
        .equal(3);
    });

    it('Betty Level 4', function levelFour() {
      removeAllEntities();
      defineTestFixtures(['minimal', 'extended.courses.interests', 'betty.student.picture', 'betty.level1',
        'betty.level2', 'opportunities', 'extended.opportunities', 'betty.level3', 'betty.level4']);
      const bettyProfile = StudentProfiles.findDoc({ username: 'betty@hawaii.edu' });
      expect(defaultCalcLevel(bettyProfile.userID))
        .to
        .equal(4); // CAM: This will have to change with issue-302
    });

    it('Betty Level 5', function levelFive() {
      removeAllEntities();
      defineTestFixtures(['minimal', 'extended.courses.interests', 'betty.student.picture', 'betty.level1',
        'betty.level2', 'opportunities', 'extended.opportunities', 'betty.level3', 'betty.level5']);
      const bettyProfile = StudentProfiles.findDoc({ username: 'betty@hawaii.edu' });
      expect(defaultCalcLevel(bettyProfile.userID))
        .to
        .equal(5); // CAM: This will have to change with issue-302
    });

    it('Betty Level 6', function levelSix() {
      removeAllEntities();
      defineTestFixtures(['minimal', 'extended.courses.interests', 'betty.student.picture', 'betty.level1',
        'betty.level2', 'opportunities', 'extended.opportunities', 'betty.level3', 'betty.level6']);
      const bettyProfile = StudentProfiles.findDoc({ username: 'betty@hawaii.edu' });
      expect(defaultCalcLevel(bettyProfile.userID))
        .to
        .equal(6); // CAM: This will have to change with issue-302
    });
  });
}
