import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
// @ts-ignore
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
// @ts-ignore
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';
import BaseCollection from '../base/BaseCollection';
import { CareerGoals } from '../career/CareerGoalCollection';
import { Users } from '../user/UserCollection';
import { ROLE } from '../role/Role';
import { IFavoriteCareerGoalDefine, IFavoriteUpdate } from '../../typings/radgrad'; // eslint-disable-line no-unused-vars

class FavoriteCareerGoalCollection extends BaseCollection {
  public readonly publicationNames: {
    scoreboard: string;
  }

  /** Creates the FavoriteCareerGoal collection */
  constructor() {
    super('FavoriteCareerGoal', new SimpleSchema({
      careerGoalID: SimpleSchema.RegEx.Id,
      studentID: SimpleSchema.RegEx.Id,
      retired: { type: Boolean, optional: true },
    }));
    this.publicationNames = {
      scoreboard: `${this.collectionName}.scoreboard`,
    };
  }

  /**
   * Defines a new FavoriteCareerGoal.
   * @param careerGoal the careerGoal slug.
   * @param student the student's username.
   * @param retired the retired status.
   * @returns {void|*|boolean|{}}
   */
  define({ careerGoal, student, retired = false }: IFavoriteCareerGoalDefine) {
    const careerGoalID = CareerGoals.getID(careerGoal);
    const studentID = Users.getID(student);
    const doc = this.collection.findOne({ studentID, careerGoalID });
    if (doc) {
      return doc._id;
    }
    return this.collection.insert({ careerGoalID, studentID, retired });
  }

  /**
   * Updates the retired status.
   * @param docID the ID of the FavoriteCareerGoal.
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
   * Remove the FavoriteCareerGoal.
   * @param docID The docID of the FavoriteCareerGoal.
   */
  removeIt(docID) {
    this.assertDefined(docID);
    // OK, clear to delete.
    super.removeIt(docID);
  }

  /**
   * Removes all the FavoriteCareerGoals for the user.
   * @param user the username.
   */
  removeUser(user) {
    const studentID = Users.getID(user);
    this.collection.remove({ studentID });
  }

  /**
   * Publish CareerGoalFavorites. If logged in as ADMIN get all, otherwise only get the CareerGoalFavorites for the
   * studentID.
   * Also publishes the CareerGoalFavorites scoreboard.
   */
  publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publish(this.collectionName, function filterStudentID(studentID) { // eslint-disable-line
        if (!studentID) {
          return this.ready();
        }
        if (Roles.userIsInRole(studentID, [ROLE.ADMIN])) {
          return instance.collection.find();
        }
        return instance.collection.find({ studentID });
      });
      Meteor.publish(this.publicationNames.scoreboard, function publishCareerGoalScoreboard() {
        ReactiveAggregate(this, instance.collection, [
          {
            $group: {
              _id: '$careerGoalID',
              count: { $sum: 1 },
            },
          },
          { $project: { count: 1, careerGoalID: 1 } },
        ], { clientCollection: 'CareerGoalFavoritesScoreboard' });
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
   * Returns the CareerGoal associated with the FavoriteCareerGoal with the given instanceID.
   * @param instanceID The id of the CareerGoalInstance.
   * @returns {Object} The associated CareerGoal.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getCareerGoalDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return CareerGoals.findDoc(instance.careerGoalID);
  }

  /**
   * Returns the CareerGoal slug for the favorite's corresponding CareerGoal.
   * @param instanceID The FavoriteCareerGoal ID.
   * @return {string} The careerGoal slug.
   */
  getCareerGoalSlug(instanceID) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return CareerGoals.findSlugByID(instance.careerGoalID);
  }

  /**
   * Returns the Student profile associated with the FavoriteCareerGoal with the given instanceID.
   * @param instanceID The ID of the FavoriteCareerGoal.
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
   * @param instanceID the FavoriteCareerGoal id.
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
   * Checks semesterID, careerGoalID, and studentID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find()
      .forEach(doc => {
        if (!CareerGoals.isDefined(doc.careerGoalID)) {
          problems.push(`Bad careerGoalID: ${doc.careerGoalID}`);
        }
        if (!Users.isDefined(doc.studentID)) {
          problems.push(`Bad studentID: ${doc.studentID}`);
        }
      });
    return problems;
  }

  /**
   * Returns an object representing the FavoriteCareerGoal docID in a format acceptable to define().
   * @param docID The docID of a FavoriteCareerGoal.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID): IFavoriteCareerGoalDefine {
    const doc = this.findDoc(docID);
    const careerGoal = CareerGoals.findSlugByID(doc.careerGoalID);
    const student = Users.getProfile(doc.studentID).username;
    const retired = doc.retired;
    return { careerGoal, student, retired };
  }

}

export const FavoriteCareerGoals = new FavoriteCareerGoalCollection();
