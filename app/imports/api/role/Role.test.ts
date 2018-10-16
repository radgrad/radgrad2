import { expect } from 'chai';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { assertRole, isRole, ROLE } from '../role/Role';

/* tslint:disable:ter-prefer-arrow-callback no-unused-expression */
/* tslint-env mocha */

if (Meteor.isServer) {
  describe('Role', function testSuite() {
    it('Test role definitions, isRole', function test() {
      expect(Roles.getAllRoles().fetch()).to.have.lengthOf(6);
      expect(isRole(ROLE.FACULTY)).to.be.true;
      expect(isRole('Grad Student')).to.be.false;
    });

    it('assertRole', function test() {
      expect(function foo() { assertRole(ROLE.STUDENT); }).to.not.throw(Error);
      expect(function foo() { assertRole('foo'); }).to.throw(Error);
    });
  });
}
