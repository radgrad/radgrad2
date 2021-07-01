import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import 'mocha';
import { Users } from '../user/UserCollection';
import { UserInteractions } from './UserInteractionCollection';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { UserInteraction } from '../../typings/radgrad';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('UserInteractionCollection', function testSuite() {
    let username;

    before(function setup() {
      removeAllEntities();
      const userID = makeSampleUser();
      username = Users.getProfile(userID).username;
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1() {
      fc.assert(
        fc.property(fc.lorem(1), fc.array(fc.lorem(1), 1, 5), (type, typeData) => {
          const docID = UserInteractions.define({ username, type, typeData });
          expect(UserInteractions.isDefined(docID)).to.be.true;
          UserInteractions.removeIt(docID);
          expect(UserInteractions.isDefined(docID)).to.be.false;
        }),
      );
    });

    it('Cannot define duplicates', function test2() {
      const type: string = faker.lorem.word();
      const typeData: string[] = [faker.lorem.word(), faker.lorem.word()];
      const docID1: string = UserInteractions.define({ username, type, typeData });
      const docID1Object: UserInteraction = UserInteractions.findOne({ _id: docID1 });
      const docID1Timestamp: Date = docID1Object.timestamp;
      const docID2: string = UserInteractions.define({ username, type, typeData, timestamp: docID1Timestamp });

      expect(docID1).to.equal(docID2);
      expect(UserInteractions.isDefined(docID1)).to.be.true;
      UserInteractions.removeIt(docID2);
      expect(UserInteractions.isDefined(docID1)).to.be.false;
    });

    it('Can restoreOne then dumpOne', function test3() {
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(1), fc.array(fc.lorem(1), 1, 5), fc.date(), (name, type, typeData, timestamp) => {
          const dumpObject = {
            username: name,
            type,
            typeData,
            timestamp,
          };
          const docID = UserInteractions.restoreOne(dumpObject);
          expect(UserInteractions.isDefined(docID)).to.be.true;
          const dumpObject2 = UserInteractions.dumpOne(docID);
          expect(dumpObject2.username).to.equal(dumpObject.username);
          expect(dumpObject2.type).to.equal(dumpObject.type);
          expect(dumpObject2.typeData.length).to.equal(dumpObject.typeData.length);
          for (let i = 0; i < dumpObject2.typeData.length; i++) {
            expect(dumpObject2.typeData[i]).to.equal(dumpObject.typeData[i]);
          }
        }),
      );
    });

    it('Can checkIntegrity all errors', function test4() {
      fc.assert(
        fc.property(fc.lorem(1), fc.array(fc.lorem(1), 1, 5), (type, typeData) => {
          UserInteractions.define({ username, type, typeData });
        }),
      );
      const errors = UserInteractions.checkIntegrity();
      expect(errors).to.have.lengthOf(0); // We no longer check the users.
    });

    it('Can removeUser', function test5() {
      fc.assert(
        fc.property(fc.lorem(1), fc.array(fc.lorem(1), 1, 5), (type, typeData) => {
          UserInteractions.define({ username, type, typeData });
        }),
      );
      UserInteractions.removeUser(username);
      const interactions = UserInteractions.find({ username }).fetch();
      expect(interactions).to.have.lengthOf(0);
    });

  });
}
