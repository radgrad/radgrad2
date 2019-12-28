import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import {} from 'mocha';
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

    it('#define, #isDefined, #removeIt', function test() {
      fc.assert(
        fc.property(fc.integer(1, 6), fc.nat(100), fc.nat(100), fc.nat(100), (level, i, c, e) => {
          const docID = IceSnapshots.define({ username, level, i, c, e, updated: moment().toDate() });
          expect(IceSnapshots.isDefined(docID)).to.be.true;
          IceSnapshots.removeIt(docID);
          expect(IceSnapshots.isDefined(docID)).to.be.false;
        }),
      );
    });
  });
}
