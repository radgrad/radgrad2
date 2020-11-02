import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import { FavoriteCourses } from './FavoriteCourseCollection';
import { makeSampleCourse } from '../course/SampleCourses';
import { makeSampleUser } from '../user/SampleUsers';
import { removeAllEntities } from '../base/BaseUtilities';
import { Slugs } from '../slug/SlugCollection';
import { Users } from '../user/UserCollection';
import { Courses } from '../course/CourseCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('FavoriteCourseCollection', function testSuite() {
    let course;
    let courseName;
    let student;
    let firstName;

    before(function setup() {
      removeAllEntities();
      course = makeSampleCourse();
      courseName = Courses.findDoc(course).name;
      student = makeSampleUser();
      firstName = Users.getProfile(student).firstName;
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1() {
      const docID = FavoriteCourses.define({ course, student });
      expect(FavoriteCourses.isDefined(docID)).to.be.true;
      FavoriteCourses.removeIt(docID);
      expect(FavoriteCourses.isDefined(docID)).to.be.false;
    });

    it('Cannot define duplicates', function test2() {
      const docID1 = FavoriteCourses.define({ course, student });
      const docID2 = FavoriteCourses.define({ course, student });
      expect(docID1).to.equal(docID2);
      expect(FavoriteCourses.isDefined(docID1)).to.be.true;
      FavoriteCourses.removeIt(docID2);
      expect(FavoriteCourses.isDefined(docID1)).to.be.false;
    });

    it('Can update', function test3(done) {
      this.timeout(5000);
      const docID = FavoriteCourses.define({ course, student });
      fc.assert(
        fc.property(fc.boolean(), (retired) => {
          FavoriteCourses.update(docID, { retired });
          const fav = FavoriteCourses.findDoc(docID);
          expect(fav.retired).to.equal(retired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let fav = FavoriteCourses.findOne({});
      let docID = fav._id;
      const dumbObject = FavoriteCourses.dumpOne(docID);
      FavoriteCourses.removeIt(docID);
      expect(FavoriteCourses.isDefined(docID)).to.be.false;
      docID = FavoriteCourses.restoreOne(dumbObject);
      fav = FavoriteCourses.findDoc(docID);
      expect(fav.studentID).to.equal(student);
      expect(fav.courseID).to.equal(course);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = FavoriteCourses.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });

    it('Can get docs and slug', function test6() {
      const docID = FavoriteCourses.define({ course, student });
      const courseDoc = FavoriteCourses.getCourseDoc(docID);
      expect(courseDoc).to.exist;
      expect(courseDoc.name).to.equal(courseName);
      const courseSlug = Slugs.getNameFromID(courseDoc.slugID);
      expect(FavoriteCourses.getCourseSlug(docID)).to.equal(courseSlug);
      const studentDoc = FavoriteCourses.getStudentDoc(docID);
      expect(studentDoc).to.exist;
      expect(studentDoc.firstName).to.equal(firstName);
      const studentUsername = FavoriteCourses.getStudentUsername(docID);
      expect(studentUsername.startsWith('student')).to.be.true;
    });
  });
}
