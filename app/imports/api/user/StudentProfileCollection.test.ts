import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {} from 'mocha';
import { removeAllEntities } from '../base/BaseUtilities';
import { StudentProfiles } from './StudentProfileCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';

/* tslint:disable:ter-prefer-arrow-callback no-unused-expression */

if (Meteor.isServer) {
  describe('StudentProfileCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #update, #removeIt, #dumpOne, #restoreOne', function test() {
      const username = 'amytaka@hawaii.edu';
      const firstName = 'Amy';
      const lastName = 'Takayesu';
      const picture = 'amy.jpg';
      const website = 'http://amytaka.github.io';
      const interests = [];
      const careerGoals = [];
      const level = 6;
      const declaredAcademicTerm = 'Spring-2017';
      let docID = StudentProfiles.define({
        username, firstName, lastName, picture, website, interests,
        careerGoals, level, declaredAcademicTerm,
      });
      expect(StudentProfiles.isDefined(docID)).to.be.true;
      let doc = StudentProfiles.findDoc(docID);
      // console.log(doc);
      expect(doc).to.be.an('object');
      expect(doc.shareUsername).to.be.false;
      expect(doc.shareInterests).to.be.false;
      let dumpObject = StudentProfiles.dumpOne(docID);
      expect(dumpObject.retired).to.be.false;
      expect(dumpObject.shareUsername).to.be.false;
      expect(dumpObject.shareInterests).to.be.false;
      expect(StudentProfiles.findNonRetired().length).to.equal(1);
      StudentProfiles.update(docID, { retired: true });
      expect(StudentProfiles.findNonRetired().length).to.equal(0);
      const term = AcademicTerms.findDoc(doc.declaredAcademicTermID);
      StudentProfiles.removeIt(docID);
      AcademicTerms.removeIt(term._id); // clean up the AcademicTerm
      expect(StudentProfiles.isDefined(docID)).to.be.false;
      docID = StudentProfiles.restoreOne(dumpObject);
      doc = StudentProfiles.findDoc(docID);
      expect(doc.shareUsername).to.be.false;
      expect(doc.shareInterests).to.be.false;
      expect(StudentProfiles.isDefined(docID)).to.be.true;
      StudentProfiles.update(docID, { retired: true, shareInterests: true });
      dumpObject = StudentProfiles.dumpOne(docID);
      expect(dumpObject.retired).to.be.true;
      expect(dumpObject.shareInterests).to.be.true;
      StudentProfiles.removeIt(docID);
    });
  });
}
