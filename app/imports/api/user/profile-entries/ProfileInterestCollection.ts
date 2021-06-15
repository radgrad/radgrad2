import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import BaseCollection from '../../base/BaseCollection';
import { Interests } from '../../interest/InterestCollection';
import { Users } from '../UserCollection';
import { ROLE } from '../../role/Role';
import { ProfileInterestDefine, ProfileEntryUpdate } from '../../../typings/radgrad';

class ProfileInterestCollection extends BaseCollection {

  /** Creates the ProfileInterest collection */
  constructor() {
    super('ProfileInterest', new SimpleSchema({
      interestID: SimpleSchema.RegEx.Id,
      userID: SimpleSchema.RegEx.Id,
      retired: { type: Boolean, optional: true },
    }));
  }

  /**
   * Defines a new ProfileInterest.
   * @param interest the interest slug.
   * @param student the student's username.
   * @param retired the retired status.
   * @returns {void|*|boolean|{}}
   */
  define({ interest, username, retired = false }) {
    const interestID = Interests.getID(interest);
    const userID = Users.getID(username);
    const doc = this.collection.findOne({ userID, interestID });
    if (doc) {
      return doc._id;
    }
    return this.collection.insert({ interestID, userID, retired });
  }

  /**
   * Updates the retired status.
   * @param docID the ID of the ProfileInterest.
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
   * Remove the ProfileInterest.
   * @param docID The docID of the ProfileInterest.
   */
  removeIt(docID) {
    this.assertDefined(docID);
    // OK, clear to delete.
    return super.removeIt(docID);
  }

  /**
   * Removes all the ProfileInterests for the user.
   * @param user the username.
   */
  removeUser(user) {
    const userID = Users.getID(user);
    this.collection.remove({ userID });
  }

  /**
   * Publish ProfileInterests. If logged in as ADMIN get all, otherwise only get the ProfileInterests for the
   * studentID.
   * Also publishes the ProfileInterests forecast.
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
   * Returns the Interest associated with the ProfileInterest with the given instanceID.
   * @param instanceID The id of the InterestInstance.
   * @returns {Object} The associated Interest.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getInterestDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return Interests.findDoc(instance.interestID);
  }

  /**
   * Returns the Interest slug for the profile's corresponding Interest.
   * @param instanceID The ProfileInterest ID.
   * @return {string} The interest slug.
   */
  getInterestSlug(instanceID) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return Interests.findSlugByID(instance.interestID);
  }

  /**
   * Returns the list of non-retired Interest slugs associated with this username.
   * @param username The username
   * @returns {Array<any>} Interest slugs.
   */
  getInterestSlugs(username) {
    const userID = Users.getID(username);
    const documents = this.collection.find({ userID, retired: false });
    return documents.map(document => Interests.findSlugByID(document.interestID));
  }

  /**
   * Returns the Student profile associated with the ProfileInterest with the given instanceID.
   * @param instanceID The ID of the ProfileInterest.
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
   * @param instanceID the ProfileInterest id.
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
   * Checks semesterID, interestID, and userID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find()
      .forEach(doc => {
        if (!Interests.isDefined(doc.interestID)) {
          problems.push(`Bad interestID: ${doc.interestID}`);
        }
        if (!Users.isDefined(doc.userID)) {
          problems.push(`Bad userID: ${doc.userID}`);
        }
      });
    return problems;
  }

  /**
   * Returns an object representing the ProfileInterest with given docID in a format acceptable to define().
   * @param docID the docID of a ProfileInterest
   * @returns {ProfileInterestDefine}
   */
  dumpOne(docID): ProfileInterestDefine {
    const doc = this.findDoc(docID);
    const interest = Interests.findSlugByID(doc.interestID);
    const username = Users.getProfile(doc.userID).username;
    const retired = doc.retired;
    return { interest, username, retired };
  }

  /**
   * Dumps all the ProfileInterests for the given usernameOrID.
   * @param {string} usernameOrID
   * @return {ProfileInterestDefine[]}
   */
  dumpUser(usernameOrID: string): ProfileInterestDefine[] {
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

export const ProfileInterests = new ProfileInterestCollection();
