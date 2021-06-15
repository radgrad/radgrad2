import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { defineMethod, removeItMethod, updateMethod } from '../base/BaseCollection.methods';
import { StudentProfiles } from './StudentProfileCollection';
import { defineTestFixturesMethod, withRadGradSubscriptions, withLoggedInUser } from '../test/test-utilities';
import { dumpStudentMethod } from './StudentProfileCollection.methods';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const delay = 500;

if (Meteor.isClient) {
  describe('StudentProfileCollection Meteor Methods ', function test() {
    const collectionName = StudentProfiles.getCollectionName();
    const username = 'amytaka';
    const firstName = 'Amy';
    const lastName = 'Takayesu';
    const picture = 'amytaka.jpg';
    const website = 'http://amytaka.github.io';
    const interests = [];
    const careerGoals = [];
    const level = 6;

    before(function (done) {
      defineTestFixturesMethod.call(['minimal', 'abi.student', 'extended.courses.interests', 'betty.student', 'betty.level1', 'betty.level2', 'opportunities', 'extended.opportunities', 'betty.level3'], done);
    });

    it('Define Method', async function () {
      await withLoggedInUser();
      await withRadGradSubscriptions();
      const definitionData = { username, firstName, lastName, picture, website, interests, careerGoals, level };
      const profileID = await defineMethod.callPromise({ collectionName, definitionData });
      await sleep(delay); // give the system time to propagate the changes
      const profile = StudentProfiles.findDoc({ _id: profileID });
      // console.log(profileID, profile);
      expect(profile.username).to.equal(username);
      expect(profile.level).to.equal(level);
      expect(profile.userID).to.not.equal(StudentProfiles.getFakeUserId());
    });

    it('Update Method', async function () {
      const id = StudentProfiles.getID(username);
      await updateMethod.callPromise({ collectionName, updateData: { id, level: 4 } });
      await sleep(delay); // give the system time to propagate the changes
      const profile = StudentProfiles.findDoc({ _id: id });
      expect(profile.level).to.equal(4);
    });

    it('Remove Method', async function () {
      const instance = StudentProfiles.getID(username);
      // const profile = StudentProfiles.findDoc({ username });
      // console.log(instance, profile);
      await removeItMethod.callPromise({ collectionName, instance });
    });

    it('Can build student dump object', async function test5() {
      const dump = await dumpStudentMethod.callPromise('betty@hawaii.edu');
      expect(dump.collections.length).to.equal(9); // StudentProfile, 2 instance, 4 profile, Review, VerificationRequests
    });
  });
}
