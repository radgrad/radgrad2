import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import faker from 'faker';
import { removeAllEntities } from '../base/BaseUtilities';
import { makeSampleUser } from '../user/SampleUsers';
import { AdvisorLogs } from './AdvisorLogCollection';
import { ROLE } from '../role/Role';
import { Users } from '../user/UserCollection';
// import { PublicationCollector } from 'meteor/johanbrook:publication-collector';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('AdvisorLogCollection', function testSuite() {
    let student;
    let advisor;
    let text;

    before(function setup() {
      removeAllEntities();
      student = makeSampleUser();
      advisor = makeSampleUser(ROLE.ADVISOR);
      text = faker.lorem.words();
    });

    after(function tearDown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(5000);
      fc.assert(
        fc.property(fc.lorem(24), fc.boolean(), (fcText, fcRetired) => {
          const docID = AdvisorLogs.define({ advisor, student, text: fcText, retired: fcRetired });
          expect(AdvisorLogs.isDefined(docID)).to.be.true;
          const doc = AdvisorLogs.findDoc(docID);
          expect(doc.advisorID).to.equal(advisor);
          expect(doc.studentID).to.equal(student);
          expect(doc.text).to.equal(fcText);
          expect(doc.retired).to.equal(fcRetired);
          AdvisorLogs.removeIt(docID);
          expect(AdvisorLogs.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Can update', function test2(done) {
      this.timeout(5000);
      text = faker.lorem.words();
      AdvisorLogs.define({ advisor, student, text });
      let doc = AdvisorLogs.findOne({});
      const docID = doc._id;
      fc.assert(
        fc.property(fc.lorem(24), fc.boolean(), (fcText, fcRetired) => {
          AdvisorLogs.update(docID, { text: fcText, retired: fcRetired });
          doc = AdvisorLogs.findDoc(docID);
          expect(doc.text).to.equal(fcText);
          expect(doc.retired).to.equal(fcRetired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test3() {
      let doc = AdvisorLogs.findOne({});
      let docID = doc._id;
      const dumpObject = AdvisorLogs.dumpOne(docID);
      AdvisorLogs.removeIt(docID);
      expect(AdvisorLogs.isDefined(docID)).to.be.false;
      docID = AdvisorLogs.restoreOne(dumpObject);
      doc = AdvisorLogs.findDoc(docID);
      expect(doc.text).to.equal(dumpObject.text);
      expect(doc.retired).to.equal(dumpObject.retired);
    });

    it('Can check integrity no errors', function test4() {
      const problems = AdvisorLogs.checkIntegrity();
      expect(problems.length).to.equal(0);
    });

    it('Can getAdvisorDoc and getStudentDoc', function test() {
      const docID = AdvisorLogs.define({ advisor, student, text });
      const advisorDoc = AdvisorLogs.getAdvisorDoc(docID);
      const a = Users.getProfile(advisor);
      expect(advisorDoc.username).to.equal(a.username);
      const studentDoc = AdvisorLogs.getStudentDoc(docID);
      const s = Users.getProfile(student);
      expect(studentDoc.username).to.equal(s.username);
      AdvisorLogs.removeIt(docID);
    });
  });
}
