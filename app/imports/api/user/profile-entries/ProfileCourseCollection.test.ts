import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import fc from 'fast-check';
import { ProfileCourses } from './ProfileCourseCollection';
import { makeSampleCourse } from '../../course/SampleCourses';
import { makeSampleUser } from '../SampleUsers';
import { removeAllEntities } from '../../base/BaseUtilities';
import { Slugs } from '../../slug/SlugCollection';
import { Users } from '../UserCollection';
import { Courses } from '../../course/CourseCollection';

/* eslint prefer-arrow-callback: "off",  @typescript-eslint/no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('ProfileCourseCollection', function testSuite() {
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
      const docID = ProfileCourses.define({ course, student });
      expect(ProfileCourses.isDefined(docID)).to.be.true;
      ProfileCourses.removeIt(docID);
      expect(ProfileCourses.isDefined(docID)).to.be.false;
    });

    it('Cannot define duplicates', function test2() {
      const docID1 = ProfileCourses.define({ course, student });
      const docID2 = ProfileCourses.define({ course, student });
      expect(docID1).to.equal(docID2);
      expect(ProfileCourses.isDefined(docID1)).to.be.true;
      ProfileCourses.removeIt(docID2);
      expect(ProfileCourses.isDefined(docID1)).to.be.false;
    });

    it('Can update', function test3(done) {
      const docID = ProfileCourses.define({ course, student });
      fc.assert(
        fc.property(fc.boolean(), (retired) => {
          ProfileCourses.update(docID, { retired });
          const fav = ProfileCourses.findDoc(docID);
          expect(fav.retired).to.equal(retired);
        }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      let fav = ProfileCourses.findOne({});
      let docID = fav._id;
      const dumbObject = ProfileCourses.dumpOne(docID);
      ProfileCourses.removeIt(docID);
      expect(ProfileCourses.isDefined(docID)).to.be.false;
      docID = ProfileCourses.restoreOne(dumbObject);
      fav = ProfileCourses.findDoc(docID);
      expect(fav.studentID).to.equal(student);
      expect(fav.courseID).to.equal(course);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = ProfileCourses.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });

    it('Can get docs and slug', function test6() {
      const docID = ProfileCourses.define({ course, student });
      const courseDoc = ProfileCourses.getCourseDoc(docID);
      expect(courseDoc).to.exist;
      expect(courseDoc.name).to.equal(courseName);
      const courseSlug = Slugs.getNameFromID(courseDoc.slugID);
      expect(ProfileCourses.getCourseSlug(docID)).to.equal(courseSlug);
      const studentDoc = ProfileCourses.getStudentDoc(docID);
      expect(studentDoc).to.exist;
      expect(studentDoc.firstName).to.equal(firstName);
      const studentUsername = ProfileCourses.getStudentUsername(docID);
      expect(studentUsername.startsWith('student')).to.be.true;
    });
  });
}
