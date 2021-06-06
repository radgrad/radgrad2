import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import BaseCollection from '../../base/BaseCollection';
import { CareerGoals } from '../../career/CareerGoalCollection';
import { Users } from '../UserCollection';
import { ProfileCareerGoalDefine, ProfileEntryUpdate } from '../../../typings/radgrad';
import { ROLE } from '../../role/Role';

class ProfileCareerGoalCollection extends BaseCollection {

  /** Creates the ProfileCareerGoal collection */
  constructor() {
    super('ProfileCareerGoal', new SimpleSchema({
      careerGoalID: SimpleSchema.RegEx.Id,
      userID: SimpleSchema.RegEx.Id,
      retired: { type: Boolean, optional: true },
    }));
  }

  /**
   * Defines a new ProfileCareerGoal.
   * @param careerGoal the careerGoal slug.
   * @param username the user's username.
   * @param retired the retired status.
   * @returns {void|*|boolean|{}}
   */
  define({ careerGoal, username, retired = false }: ProfileCareerGoalDefine) {
    // console.log(`ProfileCareerGoal.define ${careerGoal}, ${username}, ${retired}`);
    const careerGoalID = CareerGoals.getID(careerGoal);
    const userID = Users.getID(username);
    const doc = this.collection.findOne({ userID, careerGoalID });
    if (doc) {
      return doc._id;
    }
    return this.collection.insert({ careerGoalID, userID, retired });
  }

  /**
   * Updates the retired status.
   * @param docID the ID of the ProfileCareerGoal.
   * @param retired the new retired value.
   */
  update(docID, { retired }: { retired?: boolean }) {
    this.assertDefined(docID);
    const updateData: ProfileEntryUpdate = {};
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the ProfileCareerGoal.
   * @param docID The docID of the ProfileCareerGoal.
   */
  removeIt(docID) {
    // console.log(`ProfileCareerGoal.removeIt ${docID}`);
    this.assertDefined(docID);
    // OK, clear to delete.
    return super.removeIt(docID);
  }

  /**
   * Removes all the ProfileCareerGoals for the user.
   * @param user the username.
   */
  removeUser(user: string) {
    const userID = Users.getID(user);
    this.collection.remove({ userID });
  }

  /**
   * Publish ProfileCareerGoals. If ADMIN get all, otherwise only get the ProfileCareerGoals for the userID.
   * Also publishes the ProfileCareerGoals forecast.
   */
  publish() {
    if (Meteor.isServer) {
      const collection = this.collection;
      Meteor.publish(this.collectionName, function filterStudentID(userID) { // eslint-disable-line meteor/audit-argument-checks
        if (_.isNil(userID)) {
          return this.ready();
        }
        const profile = Users.getProfile(userID);
        if ([ROLE.ADMIN, ROLE.ADVISOR].includes(profile.role)) {
          return collection.find();
        }
        return collection.find({ userID });
      });
    }
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin, Advisor or Student.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY, ROLE.STUDENT]);
  }

  /**
   * Returns the CareerGoal associated with the ProfileCareerGoal with the given instanceID.
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
   * Returns the CareerGoal slug for the Profile's corresponding CareerGoal.
   * @param instanceID The ProfileCareerGoal ID.
   * @return {string} The careerGoal slug.
   */
  getCareerGoalSlug(instanceID) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return CareerGoals.findSlugByID(instance.careerGoalID);
  }

  /**
   * Returns the list of non-retired Career Goal slugs associated with this username.
   * @param username The username
   * @returns {Array<any>} Career Goal slugs.
   */
  getCareerGoalSlugs(username) {
    const userID = Users.getID(username);
    const documents = this.collection.find({ userID, retired: false });
    return documents.map(document => CareerGoals.findSlugByID(document.careerGoalID));
  }

  /**
   * Returns the Student profile associated with the ProfileCareerGoal with the given instanceID.
   * @param instanceID The ID of the ProfileCareerGoal.
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
   * @param instanceID the ProfileCareerGoal id.
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
   * Checks semesterID, careerGoalID, and userID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find()
      .forEach(doc => {
        if (!CareerGoals.isDefined(doc.careerGoalID)) {
          problems.push(`Bad careerGoalID: ${doc.careerGoalID}`);
        }
        if (!Users.isDefined(doc.userID)) {
          problems.push(`Bad userID: ${doc.userID}`);
        }
      });
    return problems;
  }

  /**
   * Returns an object representing the ProfileCareerGoal docID in a format acceptable to define().
   * @param docID The docID of a ProfileCareerGoal.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID): ProfileCareerGoalDefine {
    const doc = this.findDoc(docID);
    const careerGoal = CareerGoals.findSlugByID(doc.careerGoalID);
    const username = Users.getProfile(doc.userID).username;
    const retired = doc.retired;
    return { careerGoal, username, retired };
  }

  /**
   * Dumps all the ProfileCareerGoals for the given usernameOrID.
   * @param {string} usernameOrID
   * @return {ProfileCareerGoalDefine[]}
   */
  dumpUser(usernameOrID: string): ProfileCareerGoalDefine[] {
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

export const ProfileCareerGoals = new ProfileCareerGoalCollection();
