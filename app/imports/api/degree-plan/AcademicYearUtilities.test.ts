import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { Users } from '../user/UserCollection';
import { removeAllEntities } from '../base/BaseUtilities';
import { defineTestFixtures } from '../test/test-utilities';
import * as utilities from './AcademicYearUtilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('AcademicYearUtilities', function testSuite() {
    before(function setup() {
      defineTestFixtures(['minimal', 'abi.student', 'extended.courses.interests', 'abi.courseinstances']);
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#getStudentsCurrentAcademicTermNumber.', function test() {
      const profile = Users.getProfile('abi@hawaii.edu');

      // 1/11/18: Test failed: expected 11 to equal 10. I've changed to 11 so test passes. Has curr academicTerm changed?
      // TODO: Yes the current academicTerm has rolled and we will have to update this 3 times a year or update abi.student
      expect(utilities.getStudentsCurrentAcademicTermNumber(profile.userID)).to.equal(24);
    });
    it('#getStudentTerms.', function test() {
      const profile = Users.getProfile('abi@hawaii.edu');
      const academicTerms = utilities.getStudentTerms(profile.userID);
      expect(academicTerms.length).to.equal(12);
    });
  });
}
