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
    let userID;
    let username;
    let firstName;

    before(function setup() {
      removeAllEntities();
      course = makeSampleCourse();
      courseName = Courses.findDoc(course).name;
      userID = makeSampleUser();
      username = Users.getProfile(userID).username;
      firstName = Users.getProfile(userID).firstName;
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1() {
      const docID = ProfileCourses.define({ course, username });
      expect(ProfileCourses.isDefined(docID)).to.be.true;
      ProfileCourses.removeIt(docID);
      expect(ProfileCourses.isDefined(docID)).to.be.false;
    });

    it('Cannot define duplicates', function test2() {
      const docID1 = ProfileCourses.define({ course, username });
      const docID2 = ProfileCourses.define({ course, username });
      expect(docID1).to.equal(docID2);
      expect(ProfileCourses.isDefined(docID1)).to.be.true;
      ProfileCourses.removeIt(docID2);
      expect(ProfileCourses.isDefined(docID1)).to.be.false;
    });

    it('Can update', function test3(done) {
      const docID = ProfileCourses.define({ course, username });
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
      const dumpObject = ProfileCourses.dumpOne(docID);
      ProfileCourses.removeIt(docID);
      expect(ProfileCourses.isDefined(docID)).to.be.false;
      docID = ProfileCourses.restoreOne(dumpObject);
      expect(ProfileCourses.isDefined(docID)).to.be.true;
      fav = ProfileCourses.findDoc(docID);
      expect(fav.courseID).to.equal(course);
      expect(fav.userID).to.equal(userID);
    });

    it('Can checkIntegrity no errors', function test5() {
      const errors = ProfileCourses.checkIntegrity();
      expect(errors).to.have.lengthOf(0);
    });

    it('Can get docs and slug', function test6() {
      const docID = ProfileCourses.define({ course, username });
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

    it('Can dumpUser', function test7() {
      username = makeSampleUser();
      const numToMake = 10;
      const existingCount = ProfileCourses.count();
      for (let i = 0; i < numToMake; i++) {
        course = makeSampleCourse();
        ProfileCourses.define({ course, username });
      }
      const profileCount = ProfileCourses.count();
      expect(profileCount).to.equal(existingCount + numToMake);
      const userDump = ProfileCourses.dumpUser(username);
      expect(userDump.length).to.equal(numToMake);
    });
  });
}
