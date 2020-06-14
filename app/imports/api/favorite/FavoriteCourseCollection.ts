import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';
import BaseCollection from '../base/BaseCollection';
import { Courses } from '../course/CourseCollection';
import { Users } from '../user/UserCollection';
import { ROLE } from '../role/Role';
import { IFavoriteCourseDefine, IFavoriteUpdate } from '../../typings/radgrad';

class FavoriteCourseCollection extends BaseCollection {
  public readonly publicationNames: {
    scoreboard: string;
  }

  /** Creates the FavoriteCourse collection */
  constructor() {
    super('FavoriteCourse', new SimpleSchema({
      courseID: SimpleSchema.RegEx.Id,
      studentID: SimpleSchema.RegEx.Id,
      retired: { type: Boolean, optional: true },
    }));
    this.publicationNames = {
      scoreboard: `${this.collectionName}.scoreboard`,
    };
  }

  /**
   * Defines a new FavoriteCourse.
   * @param course the course slug.
   * @param student the student's username.
   * @param retired the retired status.
   * @returns {void|*|boolean|{}}
   */
  define({ course, student, retired = false }) {
    const courseID = Courses.getID(course);
    const studentID = Users.getID(student);
    const doc = this.collection.findOne({ studentID, courseID });
    if (doc) {
      return doc._id;
    }
    return this.collection.insert({ courseID, studentID, retired });
  }

  /**
   * Updates the retired status.
   * @param docID the ID of the FavoriteCourse.
   * @param retired the new retired value.
   */
  update(docID, { retired }) {
    this.assertDefined(docID);
    const updateData: IFavoriteUpdate = {};
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the FavoriteCourse.
   * @param docID The docID of the FavoriteCourse.
   */
  removeIt(docID) {
    this.assertDefined(docID);
    // OK, clear to delete.
    return super.removeIt(docID);
  }

  /**
   * Removes all the FavoriteCourses for the user.
   * @param user the username.
   */
  removeUser(user) {
    const studentID = Users.getID(user);
    this.collection.remove({ studentID });
  }

  /**
   * Publish CourseFavorites. If logged in as ADMIN get all, otherwise only get the CourseFavorites for the studentID.
   * Also publishes the CourseFavorites scoreboard.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(this.collectionName, function filterStudentID(studentID) { // eslint-disable-line meteor/audit-argument-checks
        if (!studentID) {
          return this.ready();
        }
        const profile = Users.getProfile(studentID);
        if (_.includes([ROLE.ADMIN, ROLE.ADVISOR], profile.role)) {
          return instance.collection.find();
        }
        return instance.collection.find({ studentID });
      });
      Meteor.publish(this.publicationNames.scoreboard, function publishCourseScoreboard() {
        ReactiveAggregate(this, instance.collection, [
          {
            $group: {
              _id: '$courseID',
              count: { $sum: 1 },
            },
          },
          { $project: { count: 1, courseID: 1 } },
        ], { clientCollection: 'CourseFavoritesScoreboard' });
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
    this.assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT]);
  }

  /**
   * Returns the Course associated with the FavoriteCourse with the given instanceID.
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
   * Returns the Course slug for the favorite's corresponding Course.
   * @param instanceID The FavoriteCourse ID.
   * @return {string} The course slug.
   */
  getCourseSlug(instanceID) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return Courses.findSlugByID(instance.courseID);
  }

  /**
   * Returns the Student profile associated with the FavoriteCourse with the given instanceID.
   * @param instanceID The ID of the FavoriteCourse.
   * @returns {Object} The associated Student profile.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getStudentDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return Users.getProfile(instance.studentID);
  }

  /**
   * Returns the username associated with the studentID.
   * @param instanceID the FavoriteCourse id.
   * @returns {*}
   */
  getStudentUsername(instanceID) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return Users.getProfile(instance.studentID).username;
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks semesterID, courseID, and studentID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find()
      .forEach(doc => {
        if (!Courses.isDefined(doc.courseID)) {
          problems.push(`Bad courseID: ${doc.courseID}`);
        }
        if (!Users.isDefined(doc.studentID)) {
          problems.push(`Bad studentID: ${doc.studentID}`);
        }
      });
    return problems;
  }

  /**
   * Returns an object representing the FavoriteCourse docID in a format acceptable to define().
   * @param docID The docID of a FavoriteCourse.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID): IFavoriteCourseDefine {
    const doc = this.findDoc(docID);
    const course = Courses.findSlugByID(doc.courseID);
    const student = Users.getProfile(doc.studentID).username;
    const retired = doc.retired;
    return { course, student, retired };
  }

}

export const FavoriteCourses = new FavoriteCourseCollection();
