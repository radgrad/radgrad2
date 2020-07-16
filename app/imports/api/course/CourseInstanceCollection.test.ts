import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
// import faker from 'faker';
import fc from 'fast-check';
import 'mocha';
// import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { CourseInstances } from './CourseInstanceCollection';
import { getRandomGrade, makeSampleCourse } from './SampleCourses';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
// import { Courses } from './CourseCollection';
import { makeSampleAcademicTerm } from '../academic-term/SampleAcademicTerms';
import { ICourseInstance } from '../../typings/radgrad';
import { Slugs } from '../slug/SlugCollection';
import { Courses } from './CourseCollection';
import { Users } from '../user/UserCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('CourseInstanceCollection', function testSuite() {

    before(function setup() {
      this.timeout(5000);
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      this.timeout(5000);
      const courseID = makeSampleCourse();
      const termID = makeSampleAcademicTerm();
      const grade = getRandomGrade();
      const student = makeSampleUser();
      fc.assert(
        fc.property(fc.boolean(), fc.boolean(), fc.lorem(5), fc.integer(1, 15), fc.boolean(), (fcVerified, fcFromRegistrar, fcNote, fcCreditHrs, fcRetired) => {
          const docID = CourseInstances.define({ academicTerm: termID, course: courseID, creditHrs: fcCreditHrs, fromRegistrar: fcFromRegistrar, grade, note: fcNote, student, retired: fcRetired, verified: fcVerified });
          expect(CourseInstances.isDefined(docID)).to.be.true;
          const ci: ICourseInstance = CourseInstances.findDoc(docID);
          expect(ci.courseID).to.equal(courseID);
          expect(ci.studentID).to.equal(student);
          expect(ci.termID).to.equal(termID);
          expect(ci.grade).to.equal(grade);
          CourseInstances.removeIt(docID);
          expect(CourseInstances.isDefined(docID)).to.be.false;
        }),
      );
      done();
    });

    it('Cannot define duplicates', function test2() {
      const course = makeSampleCourse();
      const academicTerm = makeSampleAcademicTerm();
      const grade = getRandomGrade();
      const student = makeSampleUser();
      const docID1 = CourseInstances.define({ course, student, academicTerm, grade });
      const docID2 = CourseInstances.define({ course, student, academicTerm, grade });
      expect(docID1).to.equal(docID2); // should not be able to take the same class twice in the same term.
      expect(CourseInstances.isDefined(docID1)).to.be.true;
      CourseInstances.removeIt(docID1);
      expect(CourseInstances.isDefined(docID2)).to.be.false;
    });

    it('Can update', function test3(done) {
      this.timeout(5000);
      const course = makeSampleCourse();
      const academicTerm = makeSampleAcademicTerm();
      const student = makeSampleUser();
      const grade = getRandomGrade();
      const docID = CourseInstances.define({ course, student, academicTerm, grade });
      fc.assert(
        fc.property(fc.boolean(), fc.boolean(), fc.lorem(5), fc.integer(1, 15), fc.boolean(), (fcVerified, fcFromRegistrar, fcNote, fcCreditHrs, fcRetired) => {
          const termID = makeSampleAcademicTerm();
          const gradeChange = getRandomGrade();
          CourseInstances.update(docID, { termID, creditHrs: fcCreditHrs, fromRegistrar: fcFromRegistrar, grade: gradeChange, note: fcNote, retired: fcRetired, verified: fcVerified });
          const ci: ICourseInstance = CourseInstances.findDoc(docID);
          // console.log(ci, gradeChange);
          expect(ci.termID).to.equal(termID);
          expect(ci.creditHrs).to.equal(fcCreditHrs);
          expect(ci.fromRegistrar).to.equal(fcFromRegistrar);
          expect(ci.grade).to.equal(gradeChange);
          expect(ci.note).to.equal(fcNote);
          expect(ci.retired).to.equal(fcRetired);
          expect(ci.verified).to.equal(fcVerified);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const ci = CourseInstances.findOne({});
      let docID = ci._id;
      const dumpObject = CourseInstances.dumpOne(docID);
      CourseInstances.removeIt(docID);
      expect(CourseInstances.isDefined(docID)).to.be.false;
      docID = CourseInstances.restoreOne(dumpObject);
      expect(CourseInstances.isDefined(docID)).to.be.true;
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = CourseInstances.checkIntegrity();
      expect(errors.length).to.equal(0);
    });

    it('Can removeUser', function test6() {
      const ci: ICourseInstance = CourseInstances.findOne({});
      const studentID = ci.studentID;
      CourseInstances.removeUser(studentID);

      expect(CourseInstances.find({ studentID }).count()).to.equal(0);
    });

    it('Can getCourseDoc, getCourseSlug, getAcademicTermDoc, getStudentDoc', function test7() {
      const course = makeSampleCourse();
      const doc = Courses.findDoc(course);
      const academicTerm = makeSampleAcademicTerm();
      const tDoc = AcademicTerms.findDoc(academicTerm);
      const student = makeSampleUser();
      const sDoc = Users.getProfile(student);
      const grade = getRandomGrade();
      const docID = CourseInstances.define({ course, student, academicTerm, grade });

      /* getCourseDoc */
      const courseDoc = CourseInstances.getCourseDoc(docID);

      expect(doc.name).to.equal(courseDoc.name);
      expect(doc.shortName).to.equal(courseDoc.shortName);
      expect(doc.description).to.equal(courseDoc.description);

      /* getCourseSlug */
      const courseSlug = Slugs.getNameFromID(doc.slugID);

      expect(CourseInstances.getCourseSlug(docID)).to.equal(courseSlug);

      /* getAcademicTermDoc */
      const termDoc = CourseInstances.getAcademicTermDoc(docID);

      expect(tDoc.term).to.equal(termDoc.term);
      expect(tDoc.year).to.equal(termDoc.year);

      /* getStudentDoc */
      const studentDoc = CourseInstances.getStudentDoc(docID);

      expect(sDoc.username).to.equal(studentDoc.username);
    });
  });
}
