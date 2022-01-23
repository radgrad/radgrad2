import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import BaseCollection from '../../base/BaseCollection';
import { Users } from '../UserCollection';
import { ROLE } from '../../role/Role';
import { Opportunities } from '../../opportunity/OpportunityCollection';
import { ProfileOpportunityDefine, ProfileEntryUpdate } from '../../../typings/radgrad';

class ProfileOpportunityCollection extends BaseCollection {
  /** Creates the ProfileOpportunity collection */
  constructor() {
    super('ProfileOpportunity', new SimpleSchema({
      opportunityID: SimpleSchema.RegEx.Id,
      userID: SimpleSchema.RegEx.Id,
      retired: { type: Boolean, optional: true },
    }));
  }

  /**
   * Defines a new ProfileOpportunity.
   * @param opportunity the opportunity slug.
   * @param username the username's username.
   * @param retired the retired status.
   * @returns {void|*|boolean|{}}
   */
  define({ opportunity, username, retired = false }) {
    // console.log('ProfileOpportunities.define', opportunity, username, retired);
    const opportunityID = Opportunities.getID(opportunity);
    const userID = Users.getID(username);
    const doc = this.collection.findOne({ userID, opportunityID });
    if (doc) {
      return doc._id;
    }
    return this.collection.insert({ opportunityID, userID, retired });
  }

  /**
   * Updates the retired status.
   * @param docID the ID of the ProfileOpportunity.
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
   * Remove the ProfileOpportunity.
   * @param docID The docID of the ProfileOpportunity.
   */
  removeIt(docID) {
    this.assertDefined(docID);
    // OK, clear to delete.
    return super.removeIt(docID);
  }

  /**
   * Removes all the ProfileOpportunities for the user.
   * @param user the username.
   */
  removeUser(user) {
    const userID = Users.getID(user);
    this.collection.remove({ userID });
  }

  /**
   * Publish ProfileOpportunities. If logged in as ADMIN get all, otherwise only get the ProfileOpportunities for the
   * userID.
   * Also publishes the ProfileOpportunities forecast.
   */
  publish() {
    if (Meteor.isServer) {
      const collection = this.collection;
      Meteor.publish(this.collectionName, function filterStudentID(userID) { // eslint-disable-line meteor/audit-argument-checks
        if (_.isNil(userID)) {
          return this.ready();
        }
        const profile = Users.getProfile(userID);
        if ([ROLE.ADMIN, ROLE.FACULTY, ROLE.ADVISOR].includes( profile.role)) {
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
   * Returns the Opportunity associated with the ProfileOpportunity with the given instanceID.
   * @param instanceID The id of the OpportunityInstance.
   * @returns {Object} The associated Opportunity.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  getOpportunityDoc(instanceID) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return Opportunities.findDoc(instance.opportunityID);
  }

  /**
   * Returns the Opportunity slug for the profile's corresponding Opportunity.
   * @param instanceID The ProfileOpportunity ID.
   * @return {string} The opportunity slug.
   */
  getOpportunitySlug(instanceID) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return Opportunities.findSlugByID(instance.opportunityID);
  }

  /**
   * Returns the list of non-retired Opportunity slugs associated with this username.
   * @param username The username
   * @returns {Array<any>} Opportunity slugs.
   */
  getOpportunitySlugs(username) {
    const userID = Users.getID(username);
    const documents = this.collection.find({ userID, retired: false });
    return documents.map(document => Opportunities.findSlugByID(document.opportunityID));
  }

  /**
   * Returns the Student profile associated with the ProfileOpportunity with the given instanceID.
   * @param instanceID The ID of the ProfileOpportunity.
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
   * @param instanceID the ProfileOpportunity id.
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
   * Checks semesterID, opportunityID, and userID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find()
      .forEach(doc => {
        if (!Opportunities.isDefined(doc.opportunityID)) {
          problems.push(`Bad opportunityID: ${doc.opportunityID}`);
        }
        if (!Users.isDefined(doc.userID)) {
          problems.push(`Bad userID: ${doc.userID}`);
        }
      });
    return problems;
  }

  /**
   * Returns an object representing the ProfileOpportunity docID in a format acceptable to define().
   * @param docID The docID of a ProfileOpportunity.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID): ProfileOpportunityDefine {
    const doc = this.findDoc(docID);
    const opportunity = Opportunities.findSlugByID(doc.opportunityID);
    const username = Users.getProfile(doc.userID).username;
    const retired = doc.retired;
    return { opportunity, username, retired };
  }

  /**
   * Dumps all the ProfileOpportunites for the given usernameOrID.
   * @param {string} usernameOrID
   * @return {ProfileOpportunityDefine[]}
   */
  dumpUser(usernameOrID: string): ProfileOpportunityDefine[] {
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

export const ProfileOpportunities = new ProfileOpportunityCollection();
