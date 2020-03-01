import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import 'mocha';
import moment from 'moment';
import { Users } from '../user/UserCollection';
import { IceSnapshots } from './IceSnapshotCollection';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('IceSnapshotCollection', function testSuite() {
    let username;

    before(function setup() {
      removeAllEntities();
      const userID = makeSampleUser();
      username = Users.getProfile(userID).username;
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('Can define and remove', function test1() {
      fc.assert(
        fc.property(fc.integer(1, 6), fc.nat(100), fc.nat(100), fc.nat(100), (level, i, c, e) => {
          const docID = IceSnapshots.define({ username, level, i, c, e, updated: moment().toDate() });
          expect(IceSnapshots.isDefined(docID)).to.be.true;
          IceSnapshots.removeIt(docID);
          expect(IceSnapshots.isDefined(docID)).to.be.false;
        }),
      );
    });

    it('Can checkIntegrity no errors', function test2() {
      const level = faker.random.number({ min: 1, max: 6 });
      const i = faker.random.number({ min: 0, max: 150 });
      const c = faker.random.number({ min: 0, max: 150 });
      const e = faker.random.number({ min: 0, max: 150 });
      IceSnapshots.define({ username, level, i, c, e, updated: moment().toDate() });
      const errors = IceSnapshots.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });
  });
}
