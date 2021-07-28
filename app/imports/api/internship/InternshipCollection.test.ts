import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import 'mocha';
import { makeSampleInterestArray } from '../interest/SampleInterests';
import { removeAllEntities } from '../base/BaseUtilities';
import { Internships } from './InternshipCollection';
import { makeSampleInternship, makeSampleLocation } from './SampleInternships';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('InternshipCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.webUrl(), fc.lorem(7), fc.lorem(15), fc.date(), fc.nat(), fc.lorem(5), fc.emailAddress(), (url, position, description, lastUploaded, missedUploads, company, contact) => {
          const interests = makeSampleInterestArray(2);
          const location = makeSampleLocation();
          const urls = [url];
          const docID = Internships.define({ urls, interests, company, contact, location, position, description, lastUploaded, missedUploads,
          });
          expect(Internships.isDefined(docID)).to.be.true;
          Internships.removeIt(docID);
          expect(Internships.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Can update', function test2(done) {
      const docID = makeSampleInternship();
      //  { urls, position, description, interests, careerGoals, company, location, contact, posted, due }
      fc.assert(
        fc.property(fc.webUrl(), fc.lorem(7), fc.lorem(15), fc.date(), fc.nat(), fc.lorem(5), fc.emailAddress(), (url, position, description, lastUploaded, missedUploads, company, contact) => {
          const interests2 = makeSampleInterestArray();
          const location2 = makeSampleLocation();
          const urls = [url];
          Internships.update(docID, { urls, position, description, interests: interests2, company, contact, location: location2 });
          const internship = Internships.findDoc(docID);
          expect(internship.urls[0]).to.equal(url);
          expect(internship.position).to.equal(position);
          expect(internship.description).to.equal(description);
          expect(internship.interestIDs.length).to.equal(interests2.length);
        }),
      );

      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test3() {
      let docID = makeSampleInternship();
      const orig = Internships.findDoc(docID);
      const dumpObject = Internships.dumpOne(docID);
      Internships.removeIt(docID);
      expect(Internships.isDefined(docID)).to.be.false;
      docID = Internships.restoreOne(dumpObject);
      expect(Internships.isDefined(docID)).to.be.true;
      const doc = Internships.findDoc(docID);
      expect(orig.urls[0]).to.equal(doc.urls[0]);
      expect(orig.position).to.equal(doc.position);
      expect(orig.description).to.equal(doc.description);
    });
  });
}
