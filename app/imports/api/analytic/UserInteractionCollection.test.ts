import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import 'mocha';
import { Users } from '../user/UserCollection';
import { UserInteractions } from './UserInteractionCollection';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';

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

    it('Can restoreOne then dumpOne', function test2() {
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
          // console.log(dumpObject, dumpObject2);
          expect(dumpObject2.username).to.equal(dumpObject.username);
          expect(dumpObject2.type).to.equal(dumpObject.type);
          expect(dumpObject2.typeData.length).to.equal(dumpObject.typeData.length);
          for (let i = 0; i < dumpObject2.typeData.length; i++) {
            expect(dumpObject2.typeData[i]).to.equal(dumpObject.typeData[i]);
          }
        }),
      );
    });

    it('Can checkIntegrity all errors', function test3() {
      fc.assert(
        fc.property(fc.lorem(1), fc.array(fc.lorem(1), 1, 5), (type, typeData) => {
          UserInteractions.define({ username, type, typeData });
        }),
      );
      const errors = UserInteractions.checkIntegrity();
      expect(errors).to.have.lengthOf(100);
    });

    it('Can removeUser', function test4() {
      fc.assert(
        fc.property(fc.lorem(1), fc.array(fc.lorem(1), 1, 5), (type, typeData) => {
          UserInteractions.define({ username, type, typeData });
        }),
      );
      UserInteractions.removeUser(username);
      const interactions = UserInteractions.find({ username }).fetch();
      expect(interactions).to.have.lengthOf(0);
    });

    it('Can define duplicates', function test5() {
      const type = 'type';
      const typeData = ['data1', 'data2'];
      const docID = UserInteractions.define({ username, type, typeData });
      const docID2 = UserInteractions.define({ username, type, typeData });
      expect(UserInteractions.find().fetch()).to.have.lengthOf(2);
      expect(function () { UserInteractions.findDoc(docID); }).to.not.throw(Error);
      expect(function () { UserInteractions.findDoc(docID2); }).to.not.throw(Error);
      UserInteractions.removeIt(docID);
      UserInteractions.removeIt(docID2);
    });
  });
}
