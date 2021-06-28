import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import BaseCollection from '../../base/BaseCollection';
import { Courses } from '../../course/CourseCollection';
import { Users } from '../UserCollection';
import { ROLE } from '../../role/Role';
import { ProfileCourseDefine, ProfileEntryUpdate } from '../../../typings/radgrad';

class ProfileCourseCollection extends BaseCollection {

  /** Creates the ProfileCourse collection */
  constructor() {
    super('ProfileCourse', new SimpleSchema({
      courseID: SimpleSchema.RegEx.Id,
      userID: SimpleSchema.RegEx.Id,
      retired: { type: Boolean, optional: true },
    }));
  }

  /**
   * Defines a new ProfileCourse.
   * @param course the course slug.
   * @param username the student's username.
   * @param retired the retired status.
   * @returns {void|*|boolean|{}}
   */
  define({ course, username, retired = false }) {
    const courseID = Courses.getID(course);
    const userID = Users.getID(username);
    const doc = this.collection.findOne({ userID, courseID });
    if (doc) {
      return doc._id;
    }
    return this.collection.insert({ courseID, userID, retired });
  }

  /**
   * Updates the retired status.
   * @param docID the ID of the ProfileCourse.
   * @param retired the new retired value.
   */
  update(docID, { retired }) {
    this.assertDefined(docID);
    const updateData: ProfileEntryUpdate = {};
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the ProfileCourse.
   * @param docID The docID of the ProfileCourse.
   */
  removeIt(docID) {
    this.assertDefined(docID);
    // OK, clear to delete.
    return super.removeIt(docID);
  }

  /**
   * Removes all the ProfileCourses for the user.
   * @param user the username.
   */
  removeUser(user) {
    const userID = Users.getID(user);
    this.collection.remove({ userID });
  }

  /**
   * Publish ProfileCourses. If logged in as ADMIN get all, otherwise only get the ProfileCourses for the userID.
   * Also publishes the ProfileCourses forecast.
   */
  publish() {
    if (Meteor.isServer) {
      const collection = this.collection;
      Meteor.publish(this.collectionName, function filterStudentID(userID) { // eslint-disable-line meteor/audit-argument-checks
        if (_.isNil(userID)) {
          return this.ready();
        }
        const profile = Users.getProfile(userID);
        if (([ROLE.ADMIN, ROLE.ADVISOR].includes(profile.role))) {
          return collection.find();
        }
        return collection.find({ userID });
      });
    }
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin, Advisor or
   * Student.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY, ROLE.STUDENT]);
  }

  /**
   * Returns the Course associated with the ProfileCourse with the given instanceID.
   * @param instanceID The id of the CourseInstance.
   * @returns {Object} The associated Course.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getCourseDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return Courses.findDoc(instance.courseID);
  }

  /**
   * Returns the Course slug for the profile's corresponding Course.
   * @param instanceID The ProfileCourse ID.
   * @return {string} The course slug.
   */
  getCourseSlug(instanceID) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return Courses.findSlugByID(instance.courseID);
  }

  /**
   * Returns the list of non-retired Course slugs associated with this username.
   * @param username The username
   * @returns {Array<any>} Interest slugs.
   */
  getCourseSlugs(username) {
    const userID = Users.getID(username);
    const documents = this.collection.find({ userID, retired: false });
    return documents.map(document => Courses.findSlugByID(document.courseID));
  }

  /**
   * Returns the Student profile associated with the ProfileCourse with the given instanceID.
   * @param instanceID The ID of the ProfileCourse.
   * @returns {Object} The associated Student profile.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getStudentDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return Users.getProfile(instance.userID);
  }

  /**
   * Returns the username associated with the userID.
   * @param instanceID the ProfileCourse id.
   * @returns {*}
   */
  getStudentUsername(instanceID) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return Users.getProfile(instance.userID).username;
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks semesterID, courseID, and userID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find()
      .forEach(doc => {
        if (!Courses.isDefined(doc.courseID)) {
          problems.push(`Bad courseID: ${doc.courseID}`);
        }
        if (!Users.isDefined(doc.userID)) {
          problems.push(`Bad userID: ${doc.userID}`);
        }
      });
    return problems;
  }

  /**
   * Returns an object representing the ProfileCourse docID in a format acceptable to define().
   * @param docID The docID of a ProfileCourse.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID): ProfileCourseDefine {
    const doc = this.findDoc(docID);
    const course = Courses.findSlugByID(doc.courseID);
    const username = Users.getProfile(doc.userID).username;
    const retired = doc.retired;
    return { course, username, retired };
  }

  /**
   * Dumps all the ProfileCourses for the given usernameOrID.
   * @param {string} usernameOrID
   * @return {ProfileCourseDefine[]}
   */
  dumpUser(usernameOrID: string): ProfileCourseDefine[] {
    const profile = Users.getProfile(usernameOrID);
    const userID = profile.userID;
    const retVal = [];
    const instances = this.find({ userID }).fetch();
    instances.forEach((instance) => {
      retVal.push(this.dumpOne(instance._id));
    });
    return retVal;
  }
}

export const ProfileCourses = new ProfileCourseCollection();
