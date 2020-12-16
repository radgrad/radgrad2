import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import 'mocha';
import { AcademicYearInstances } from './AcademicYearInstanceCollection';
import { Users } from '../user/UserCollection';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { makeSampleAcademicTerm } from '../academic-term/SampleAcademicTerms';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { AcademicYearInstance } from '../../typings/radgrad';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('AcademicYearInstanceCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      const studentID = makeSampleUser();
      const student = Users.getProfile(studentID).username;
      fc.assert(
        fc.property(fc.integer(2017, 2027), (fcYear) => {
          const docID = AcademicYearInstances.define({ student, year: fcYear });
          expect(AcademicYearInstances.isDefined(docID)).to.be.true;
          AcademicYearInstances.removeIt(docID);
          expect(AcademicYearInstances.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Cannot define duplicates', function test2() {
      const academicTerm = makeSampleAcademicTerm();
      const year = AcademicTerms.findDoc(academicTerm).year;
      const studentID = makeSampleUser();
      const student = Users.getProfile(studentID).username;
      const docID1 = AcademicYearInstances.define({ year, student });
      const docID2 = AcademicYearInstances.define({ year, student });
      expect(docID1).to.equal(docID2);
      expect(AcademicYearInstances.isDefined(docID1)).to.be.true;
      AcademicYearInstances.removeIt(docID2);
      expect(AcademicYearInstances.isDefined(docID1)).to.be.false;
    });

    it('Can update', function test3(done) {
      const academicTerm = makeSampleAcademicTerm();
      const year = AcademicTerms.findDoc(academicTerm).year;
      const studentID = makeSampleUser();
      const student = Users.getProfile(studentID).username;
      const docID = AcademicYearInstances.define({ year, student });
      fc.assert(
        fc.property(fc.integer(2017, 2027), fc.boolean(), (fcYear, fcRetired) => {
          AcademicYearInstances.update(docID, { year: fcYear, retired: fcRetired });
          const ay = AcademicYearInstances.findDoc(docID);
          expect(ay.year).to.equal(fcYear);
          expect(ay.springYear).to.equal(fcYear + 1);
          expect(ay.retired).to.equal(fcRetired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let ay = AcademicYearInstances.findOne({});
      let docID = ay._id;
      const dumpObject = AcademicYearInstances.dumpOne(docID);
      AcademicYearInstances.removeIt(docID);
      expect(AcademicYearInstances.isDefined(docID)).to.be.false;
      docID = AcademicYearInstances.restoreOne(dumpObject);
      ay = AcademicYearInstances.findDoc(docID);
      expect(dumpObject.year).to.equal(ay.year);
      const student = Users.getProfile(ay.studentID).username;
      expect(dumpObject.student).to.equal(student);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = AcademicYearInstances.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });

    it('Can remove user', function test6() {
      const ay: AcademicYearInstance = AcademicYearInstances.findOne({});
      AcademicYearInstances.removeUser(ay.studentID);
      expect(AcademicYearInstances.find({ studentID: ay.studentID }).count()).to.equal(0);
    });
  });
}
