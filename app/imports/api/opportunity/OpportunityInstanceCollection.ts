import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
import { ProfileOpportunities } from '../user/profile-entries/ProfileOpportunityCollection';
import { Opportunities } from './OpportunityCollection';
import { ROLE } from '../role/Role';
import { AcademicYearInstances } from '../degree-plan/AcademicYearInstanceCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { Users } from '../user/UserCollection';
import { VerificationRequests } from '../verification/VerificationRequestCollection';
import BaseCollection from '../base/BaseCollection';
import { OpportunityInstance, OpportunityInstanceDefine, OpportunityInstanceUpdate } from '../../typings/radgrad';
import { iceSchema } from '../ice/IceProcessor';

/**
 * OpportunityInstances indicate that a student wants to take advantage of an Opportunity in a specific academic term.
 * @extends api/base.BaseCollection
 * @memberOf api/opportunity
 */
class OpportunityInstanceCollection extends BaseCollection {
  public publicationNames: {
    forecast: string;
    verification: string;
  };

  /**
   * Creates the OpportunityInstance collection.
   */
  constructor() {
    super('OpportunityInstance', new SimpleSchema({
      termID: { type: SimpleSchema.RegEx.Id },
      opportunityID: { type: SimpleSchema.RegEx.Id },
      verified: { type: Boolean },
      studentID: { type: SimpleSchema.RegEx.Id },
      sponsorID: { type: SimpleSchema.RegEx.Id },
      ice: { type: iceSchema, optional: true },
      retired: { type: Boolean, optional: true },
    }));
    this.publicationNames = {
      forecast: `${this.collectionName}.Forecast`,
      verification: `${this.collectionName}.Verification`,
    };
    if (Meteor.isServer) {
      this.collection.rawCollection().createIndex({ _id: 1, studentID: 1, termID: 1 });
    }
    this.defineSchema = new SimpleSchema({
      academicTerm: String,
      opportunity: String,
      sponsor: String,
      verified: { type: Boolean, optional: true },
      student: String,
      retired: { type: Boolean, optional: true },
    });
    this.updateSchema = new SimpleSchema({
      termID: { type: String, optional: true },
      verified: { type: Boolean, optional: true },
      ice: { type: iceSchema, optional: true },
      retired: { type: Boolean, optional: true },
    });
  }

  /**
   * Defines a new OpportunityInstance.
   * @example
   * OpportunityInstances.define({ academicTerm: 'Fall-2015',
   *                               opportunity: 'hack2015',
   *                               verified: false,
   *                               student: 'joesmith',
   *                              sponsor: 'johnson' });
   * @param { Object } description AcademicTerm, opportunity, and student must be slugs or IDs. Verified defaults to false.
   * Sponsor defaults to the opportunity sponsor.
   * Note that only one opportunity instance can be defined for a given academicTerm, opportunity, and student.
   * @throws {Meteor.Error} If academicTerm, opportunity, or student cannot be resolved, or if verified is not a boolean.
   * @returns The newly created docID.
   */

  public define({ academicTerm, opportunity, sponsor, verified = false, student, retired = false }: OpportunityInstanceDefine) {
    // Validate academicTerm, opportunity, verified, and studentID
    const termID = AcademicTerms.getID(academicTerm);
    const academicTermDoc = AcademicTerms.findDoc(termID);
    const studentID = Users.getID(student);
    const studentProfile = Users.getProfile(studentID);
    const opportunityID = Opportunities.getID(opportunity);
    const op = Opportunities.findDoc(opportunityID);
    let sponsorID;
    if (_.isUndefined(sponsor)) {
      sponsorID = op.sponsorID;
    } else {
      sponsorID = Users.getID(sponsor);
    }
    if (academicTermDoc.term === AcademicTerms.SPRING || academicTermDoc.term === AcademicTerms.SUMMER || academicTermDoc.term === AcademicTerms.WINTER) {
      AcademicYearInstances.define({ year: academicTermDoc.year - 1, student: studentProfile.username });
    } else {
      AcademicYearInstances.define({ year: academicTermDoc.year, student: studentProfile.username });
    }
    if ((typeof verified) !== 'boolean') {
      throw new Meteor.Error(`${verified} is not a boolean.`);
    }
    if (this.isOpportunityInstance(academicTerm, opportunity, student)) {
      return this.findOpportunityInstanceDoc(academicTerm, opportunity, student)._id;
    }
    const ice = Opportunities.findDoc(opportunityID).ice;
    ProfileOpportunities.define({ opportunity, username:student, retired });
    // Define and return the new OpportunityInstance
    // console.log(termID, opportunityID, verified, studentID, sponsorID, ice, retired);
    const opportunityInstanceID = this.collection.insert({
      termID,
      opportunityID,
      verified,
      studentID,
      sponsorID,
      ice,
      retired,
    });
    return opportunityInstanceID;
  }

  /**
   * Update the opportunity instance. Only verified and ICE fields can be updated.
   * @param docID The course instance docID (required).
   * @param termID the termID for the course instance optional.
   * @param verified boolean optional.
   * @param ice an object with fields i, c, e (optional)
   */
  public update(docID: string, { termID, verified, ice, retired }: OpportunityInstanceUpdate) {
    this.assertDefined(docID);
    const updateData: OpportunityInstanceUpdate = {};
    if (termID) {
      updateData.termID = termID;
    }
    if (_.isBoolean(verified)) {
      updateData.verified = verified;
    }
    if (ice) {
      updateData.ice = ice;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the opportunity instance.
   * @param docID The docID of the opportunity instance.
   */
  public removeIt(docID: string) {
    this.assertDefined(docID);
    // find any VerificationRequests associated with docID and remove them.
    const requests = VerificationRequests.find({ opportunityInstanceID: docID })
      .fetch();
    requests.forEach((vr) => {
      VerificationRequests.removeIt(vr._id);
    });
    return super.removeIt(docID);
  }

  /**
   * Removes all OpportunityInstance documents referring to user.
   * @param user The user, either the ID or the username.
   * @throws { Meteor.Error } If user is not an ID or username.
   */
  public removeUser(user: string) {
    const studentID = Users.getID(user);
    this.collection.remove({ studentID });
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin, Advisor or
   * Student.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  public assertValidRoleForMethod(userId: string) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY, ROLE.STUDENT]);
  }

  /**
   * Returns the opportunityInstance document associated with academicTerm, opportunity, and student.
   * @param academicTerm The academicTerm (slug or ID).
   * @param opportunity The opportunity (slug or ID).
   * @param student The student (slug or ID)
   * @returns { Object } Returns the document or null if not found.
   * @throws { Meteor.Error } If academicTerm, opportunity, or student does not exist.
   */
  public findOpportunityInstanceDoc(academicTerm: string, opportunity: string, student: string) {
    const termID = AcademicTerms.getID(academicTerm);
    const studentID = Users.getID(student);
    const opportunityID = Opportunities.getID(opportunity);
    return this.collection.findOne({ termID, studentID, opportunityID });
  }

  /**
   * Returns true if there exists an OpportunityInstance for the given academicTerm, opportunity, and student.
   * @param academicTerm The academicTerm (slug or ID).
   * @param opportunity The opportunity (slug or ID).
   * @param student The student (slug or ID).
   * @returns True if the opportunity instance exists.
   * @throws { Meteor.Error } If academicTerm, opportunity, or student does not exist.
   */
  public isOpportunityInstance(academicTerm: string, opportunity: string, student: string) {
    return !!this.findOpportunityInstanceDoc(academicTerm, opportunity, student);
  }

  /**
   * Returns the Opportunity associated with the OpportunityInstance with the given instanceID.
   * @param instanceID The id of the OpportunityInstance.
   * @returns {Object} The associated Opportunity.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  public getOpportunityDoc(instanceID: string) {
    this.assertDefined(instanceID);
    const instance: OpportunityInstance = this.collection.findOne({ _id: instanceID });
    return Opportunities.findDoc(instance.opportunityID);
  }

  /**
   * Returns the Opportunity slug for the instance's corresponding Opportunity.
   * @param instanceID The OpportunityInstance ID.
   * @return {string} The opportunity slug.
   */
  public getOpportunitySlug(instanceID: string) {
    this.assertDefined(instanceID);
    const instance: OpportunityInstance = this.collection.findOne({ _id: instanceID });
    return Opportunities.findSlugByID(instance.opportunityID);
  }

  /**
   * Returns the AcademicTerm associated with the OpportunityInstance with the given instanceID.
   * @param instanceID The id of the OpportunityInstance.
   * @returns {Object} The associated AcademicTerm.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  public getAcademicTermDoc(instanceID: string) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return AcademicTerms.findDoc(instance.termID);
  }

  /**
   * Returns the Student profile associated with the OpportunityInstance with the given instanceID.
   * @param instanceID The id of the OpportunityInstance.
   * @returns {Object} The associated Student profile.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  public getStudentDoc(instanceID: string) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return Users.getProfile(instance.studentID);
  }

  /**
   * Returns the unverified opportunity instances for the given student.
   * @param {string} student username or ID.
   * @return {OpportunityInstance[]} the unverified opportunity instances.
   */
  public getUnverifiedInstances(student: string): OpportunityInstance[] {
    const studentID = Users.getID(student);
    const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
    const ois = OpportunityInstances.findNonRetired({ studentID, verified: false });
    const oisInPast = ois.filter((oi) => {
      const term = AcademicTerms.findDoc(oi.termID);
      return term.termNumber < currentTerm.termNumber;
    });
    const requests = VerificationRequests.findNonRetired({ studentID });
    const requestedOIs = requests.map((request) => request.opportunityInstanceID);
    const unverified = oisInPast.filter((oi) => !((requestedOIs.includes(oi._id))));
    return unverified;
  }

  /**
   * Depending on the logged in user publish only their OpportunityInstances. If
   * the user is in the Role.ADMIN then publish all OpportunityInstances.
   */
  public publish() {
    if (Meteor.isServer) {
      const collection = this.collection;
      Meteor.publish(this.collectionName, function filterStudent(studentID) { // eslint-disable-line meteor/audit-argument-checks
        if (_.isNil(studentID)) {
          return this.ready();
        }
        const profile = Users.getProfile(studentID);
        if (profile.role === ROLE.ADMIN || Meteor.isAppTest) {
          return collection.find();
        }
        return collection.find({ studentID, retired: { $not: { $eq: true } } });
      });
      // eslint-disable-next-line meteor/audit-argument-checks
      Meteor.publish(this.publicationNames.verification, function publishVerificationOpportunities(studentIDs: string[]) {
        if (Meteor.isAppTest) {
          return collection.find();
        }
        return collection.find({ studentID: { $in: studentIDs } });
      });
    }
  }

  /**
   * Gets the publication names.
   * @returns {Object} The publication names.
   */
  public getPublicationNames() {
    return this.publicationNames;
  }

  /**
   * @returns {String} This opportunity instance, formatted as a string.
   * @param opportunityInstanceID The opportunity instance ID.
   * @throws {Meteor.Error} If not a valid ID.
   */
  public toString(opportunityInstanceID: string) {
    this.assertDefined(opportunityInstanceID);
    const opportunityInstanceDoc = this.findDoc(opportunityInstanceID);
    const academicTerm = AcademicTerms.toString(opportunityInstanceDoc.termID);
    const opportunityName = Opportunities.findDoc(opportunityInstanceDoc.opportunityID).name;
    return `[OI ${academicTerm} ${opportunityName}]`;
  }

  /**
   * Updates the OpportunityInstance's AcademicTerm.
   * @param opportunityInstanceID The opportunity instance ID.
   * @param termID The academicTerm id.
   * @throws {Meteor.Error} If not a valid ID.
   */
  public updateAcademicTerm(opportunityInstanceID: string, termID: string) {
    this.assertDefined(opportunityInstanceID);
    AcademicTerms.assertAcademicTerm(termID);
    this.collection.update({ _id: opportunityInstanceID }, { $set: { termID } });
  }

  /**
   * Updates the verified field.
   * @param opportunityInstanceID The opportunity instance ID.
   * @param verified The new value of verified.
   * @throws {Meteor.Error} If not a valid ID.
   */
  public updateVerified(opportunityInstanceID: string, verified: boolean) {
    this.assertDefined(opportunityInstanceID);
    this.collection.update({ _id: opportunityInstanceID }, { $set: { verified } });
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks termID, opportunityID, studentID
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity() {
    const problems = [];
    this.find().forEach((doc) => {
      if (!AcademicTerms.isDefined(doc.termID)) {
        problems.push(`Bad termID: ${doc.termID}`);
      }
      if (!Opportunities.isDefined(doc.opportunityID)) {
        problems.push(`Bad opportunityID: ${doc.opportunityID}`);
      }
      if (!Users.isDefined(doc.studentID)) {
        problems.push(`Bad studentID: ${doc.studentID}`);
      }
      if (!Users.isDefined(doc.sponsorID)) {
        problems.push(`Bad sponsorID: ${doc.sponsorID}`);
      }
      if (doc.verified && VerificationRequests.find({ opportunityInstanceID: doc._id }).fetch().length === 0) {
        const studentDoc = this.getStudentDoc(doc._id);
        const opportunityDoc = this.getOpportunityDoc(doc._id);
        const termDoc = this.getAcademicTermDoc(doc._id);
        problems.push(`No Verification Request for verified Opportunity Instance: ${opportunityDoc.name}-${studentDoc.username}-${AcademicTerms.toString(termDoc._id, false)}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the OpportunityInstance docID in a format acceptable to define().
   * @param docID The docID of an OpportunityInstance.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): OpportunityInstanceDefine {
    const doc = this.findDoc(docID);
    const academicTerm = AcademicTerms.findSlugByID(doc.termID);
    const opportunity = Opportunities.findSlugByID(doc.opportunityID);
    const verified = doc.verified;
    const student = Users.getProfile(doc.studentID).username;
    const sponsor = Users.getProfile(doc.sponsorID).username;
    const retired = doc.retired;
    return { academicTerm, opportunity, verified, student, sponsor, retired };
  }

  /**
   * Dumps the OpportunityInstances for the given usernameOrID.
   * @param {string} usernameOrID
   * @return {OpportunityInstanceDefine[]}
   */
  public dumpUser(usernameOrID: string): OpportunityInstanceDefine[] {
    const profile = Users.getProfile(usernameOrID);
    const studentID = profile.userID;
    const retVal = [];
    const instances = this.find({ studentID }).fetch();
    instances.forEach((instance) => {
      retVal.push(this.dumpOne(instance._id));
    });
    return retVal;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/opportunity.OpportunityInstanceCollection}
 * @memberOf api/opportunity
 */
export const OpportunityInstances = new OpportunityInstanceCollection();
