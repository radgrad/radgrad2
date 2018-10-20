import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { removeAllEntities } from '../base/BaseUtilities';
import { AdvisorProfiles } from './AdvisorProfileCollection';

/* tslint:disable:ter-prefer-arrow-callback no-unused-expression */

if (Meteor.isServer) {
  describe('AdvisorProfileCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #update, #removeIt, #dumpOne, #restoreOne', function test() {
      const username = 'glau@hawaii.edu';
      const firstName = 'Gerald';
      const lastName = 'Lau';
      const picture = 'glau.jpg';
      const website = 'http://glau.github.io';
      const interests = [];
      const careerGoals = [];
      const docID = AdvisorProfiles.define({ username, firstName, lastName, picture, website, interests, careerGoals });
      expect(AdvisorProfiles.isDefined(docID)).to.be.true;
      const dumpObject = AdvisorProfiles.dumpOne(docID);
      AdvisorProfiles.removeIt(docID);
      expect(AdvisorProfiles.isDefined(docID)).to.be.false;
      AdvisorProfiles.restoreOne(dumpObject);
      const id = AdvisorProfiles.getID(username);
      expect(AdvisorProfiles.isDefined(id)).to.be.true;
      AdvisorProfiles.removeIt(id);
    });
  });
}
