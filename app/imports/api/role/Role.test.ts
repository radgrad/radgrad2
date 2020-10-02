import { expect } from 'chai';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import {} from 'mocha';
import { assertRole, isRole, ROLE } from './Role';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('Role', function testSuite() {
    it('Test role definitions, isRole', function test() {
      expect(Roles.getAllRoles().fetch()).to.have.lengthOf(5);
      expect(isRole(ROLE.FACULTY)).to.be.true;
      expect(isRole('Grad Student')).to.be.false;
    });

    it('assertRole', function test() {
      expect(function foo() { assertRole(ROLE.STUDENT); }).to.not.throw(Error);
      expect(function foo() { assertRole('foo'); }).to.throw(Error);
    });
  });
}
