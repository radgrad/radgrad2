import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { moment } from 'meteor/momentjs:moment';
import BaseCollection from '../base/BaseCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { OpportunityInstances } from '../opportunity/OpportunityInstanceCollection';
import { ROLE } from '../role/Role';
import { AcademicTerms } from '../semester/AcademicTermCollection';
import { Users } from '../user/UserCollection';
import { IVerificationRequestDefine } from '../../typings/radgrad';

/**
 * Schema for the processed information of VerificationRequests.
 * @memberOf api/verification
 */
export const ProcessedSchema = new SimpleSchema({
  date: Date,
  status: String,
  verifier: String,
  feedback: { type: String, optional: true },
});

/**
 * Represents a Verification Request, such as "LiveWire Internship".
 * A student has completed an opportunity (such as an internship or project) and wants to obtain ICE Points by
 * having it verified.
 * @extends api/base.BaseCollection
 * @memberOf api/verification
 */
class VerificationRequestCollection extends BaseCollection {
  public ACCEPTED: string;
  public REJECTED: string;
  public OPEN: string;

  /**
   * Creates the VerificationRequest collection.
   */
  constructor() {
    super('VerificationRequest', new SimpleSchema({
      studentID: SimpleSchema.RegEx.Id,
      opportunityInstanceID: SimpleSchema.RegEx.Id,
      submittedOn: Date,
      status: String,
      processed: [ProcessedSchema],
      ice: { type: Object, optional: true, blackbox: true },
    }));
    this.ACCEPTED = 'Accepted';
    this.REJECTED = 'Rejected';
    this.OPEN = 'Open';
  }

  /**
   * Defines a verification request.
   * @example
   * VerificationRequests.define({ student: 'joesmith',
   *                               opportunityInstance: 'EiQYeRP4jyyre28Zw' });
   * or
   * VerificationRequests.define({ student: 'joesmith',
   *                               opportunity: 'TechHui',
   *                              semester: 'Fall-2015'});
   * @param { Object } student and opportunity must be slugs or IDs. SubmittedOn defaults to now.
   * status defaults to OPEN, and processed defaults to an empty array.
   * You can either pass the opportunityInstanceID or pass the opportunity and semester slugs. If opportunityInstance
   * is not defined, then the student, opportunity, and semester arguments are used to look it up.
   * @throws {Meteor.Error} If semester, opportunity, opportunityInstance or student cannot be resolved,
   * or if verified is not a boolean.
   * @returns The newly created docID.
   */
  public define({ student, opportunityInstance, submittedOn = moment().toDate(), status = this.OPEN, processed = [], semester, opportunity }: IVerificationRequestDefine) {
    const studentID = Users.getID(student);
    const oppInstance = opportunityInstance ? OpportunityInstances.findDoc(opportunityInstance) :
      OpportunityInstances.findOpportunityInstanceDoc(semester, opportunity, student);
    if (!oppInstance) {
      throw new Meteor.Error('Could not find the opportunity instance to associate with this verification request');
    }
    const opportunityInstanceID = oppInstance._id;
    const ice = Opportunities.findDoc(oppInstance.opportunityID).ice;
    // Define and return the new VerificationRequest
    const requestID = this.collection.insert({
      studentID, opportunityInstanceID, submittedOn, status, processed, ice,
    });
    return requestID;
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin, Advisor or
   * Student.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  public assertValidRoleForMethod(userId: string) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT]);
  }

  /**
   * Returns the VerificationRequestID associated with opportunityInstanceID, or null if not found.
   * @param opportunityInstanceID The opportunityInstanceID
   * @returns The VerificationRequestID, or null if not found.
   */
  public findVerificationRequest(opportunityInstanceID: string) {
    const result = this.collection.findOne({ opportunityInstanceID });
    return result && result._id;
  }

  /**
   * Removes all VerificationRequest documents referring to user.
   * @param user The user, either the ID or the username.
   * @throws { Meteor.Error } If user is not an ID or username.
   */
  public removeUser(user: string) {
    const studentID = Users.getID(user);
    this.collection.remove({ studentID });
  }

  /**
   * Returns the Opportunity associated with the VerificationRequest with the given instanceID.
   * @param verificationRequestID The id of the VerificationRequest.
   * @returns {Object} The associated Opportunity.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  public getOpportunityDoc(verificationRequestID: string) {
    this.assertDefined(verificationRequestID);
    const instance = this.collection.findOne({ _id: verificationRequestID });
    const opportunity = OpportunityInstances.getOpportunityDoc(instance.opportunityInstanceID);
    return opportunity;
  }

  /**
   * Returns the Opportunity associated with the VerificationRequest with the given instanceID.
   * @param verificationRequestID The id of the VerificationRequest.
   * @returns {Object} The associated Opportunity.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  public getOpportunityInstanceDoc(verificationRequestID: string) {
    this.assertDefined(verificationRequestID);
    const instance = this.collection.findOne({ _id: verificationRequestID });
    return OpportunityInstances.findDoc(instance.opportunityInstanceID);
  }

  /**
   * Returns the Semester associated with the VerificationRequest with the given instanceID.
   * @param instanceID The id of the VerificationRequest.
   * @returns {Object} The associated Semester.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  public getSemesterDoc(instanceID: string) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    const oppInstance = OpportunityInstances.findDoc(instance.opportunityInstanceID);
    return AcademicTerms.findDoc(oppInstance.semesterID);
  }

  /**
   * Returns the Sponsor (faculty) profile associated with the VerificationRequest with the given instanceID.
   * @param instanceID The id of the VerificationRequest.
   * @returns {Object} The associated Faculty profile.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  public getSponsorDoc(instanceID: string) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    const opportunity = OpportunityInstances.getOpportunityDoc(instance.opportunityInstanceID);
    return Users.getProfile(opportunity.sponsorID);
  }

  /**
   * Returns the Student profile associated with the VerificationRequest with the given instanceID.
   * @param instanceID The id of the VerificationRequest.
   * @returns {Object} The associated Student profile.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  public getStudentDoc(instanceID: string) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return Users.getProfile(instance.studentID);
  }

  /**
   * Depending on the logged in user publish only their VerificationRequests. If
   * the user is in the Role.ADMIN, ADVISOR or FACULTY then publish all Verification Requests.
   */
  public publish() {
    if (Meteor.isServer) {
      // tslint:disable-next-line: no-this-assignment
      const instance = this;
      Meteor.publish(this.collectionName, function publish() {
        if (!this.userId) {  // https://github.com/meteor/meteor/issues/9619
          return this.ready();
        }
        if (Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.FACULTY])) {
          return instance.collection.find();
        }
        return instance.collection.find({ studentID: this.userId });
      });
    }
  }

  /**
   * Updates the VerificationRequest's status and processed array.
   * @param requestID The VerificationRequest ID.
   * @param status The new Status.
   * @param processed The new array of process records.
   */
  public updateStatus(requestID: string, status: string, processed: any[]) {
    this.assertDefined(requestID);
    this.collection.update({ _id: requestID }, { $set: { status, processed } });
  }

  /**
   * Sets the passed VerificationRequest to be verified.
   * @param verificationRequestID The VerificationRequest
   * @param verifyingUser The user who did the verification.
   * @throws { Meteor.Error } If verificationRequestID or verifyingUser are not defined.
   */
  public setVerified(verificationRequestID: string, verifyingUser: string) {
    this.assertDefined(verificationRequestID);
    const userID = Users.getID(verifyingUser);
    const verifier = Users.getProfile(userID).username;
    const date = new Date();
    const status = this.ACCEPTED;
    const processed = [{ date, status, verifier }];
    this.collection.update(verificationRequestID, { $set: { status, processed } });
  }

  /**
   * Sets the verification status of the passed VerificationRequest.
   * @param verificationRequestID The ID of the verification request.
   * @param verifyingUser The user who is doing the verification.
   * @param status The status (ACCEPTED, REJECTED, OPEN).
   * @param feedback An optional feedback string.
   * @throws { Meteor.Error } If the verification request or user is not defined.
   */
  public setVerificationStatus(verificationRequestID: string, verifyingUser: string, status: string, feedback?: string) {
    this.assertDefined(verificationRequestID);
    const userID = Users.getID(verifyingUser);
    const verifier = Users.getProfile(userID).username;
    const date = new Date();
    const processRecord = { date, status, verifier, feedback };
    this.collection.update(verificationRequestID, { $set: { status }, $push: { processed: processRecord } });
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks studentID, opportunityInstanceID, semesterID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity() {
    const problems = [];
    this.find().forEach((doc) => {
      if (!Users.isDefined(doc.studentID)) {
        problems.push(`Bad studentID: ${doc.studentID}`);
      }
      if (!OpportunityInstances.isDefined(doc.opportunityInstanceID)) {
        problems.push(`Bad opportunityInstanceID: ${doc.opportunityInstanceID}`);
      }
      if (!AcademicTerms.isDefined(doc.semesterID)) {
        problems.push(`Bad semesterID: ${doc.semesterID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the VerificationRequest docID in a format acceptable to define().
   * @param docID The docID of an VerificationRequest.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): IVerificationRequestDefine {
    const doc = this.findDoc(docID);
    const student = Users.getProfile(doc.studentID).username;
    const opportunityInstance = OpportunityInstances.findDoc(doc.opportunityInstanceID);
    const semester = AcademicTerms.findSlugByID(opportunityInstance.semesterID);
    const opportunity = Opportunities.findSlugByID(opportunityInstance.opportunityID);
    const submittedOn = doc.submittedOn;
    const status = doc.status;
    const processed = doc.processed;
    return { student, semester, opportunity, submittedOn, status, processed };
  }

  /**
   * Internal helper function to simplify definition of the assertValidRoleForMethod method.
   * @param userId The userID.
   * @param roles An array of roles.
   * @throws { Meteor.Error } If userId is not defined or user is not in the specified roles.
   * @returns True if no error is thrown.
   * @ignore
   */
  public assertRole(userId: string, roles: string[]): boolean {
    if (!userId) {
      throw new Meteor.Error('unauthorized', 'You must be logged in.');
    } else
    if (!Roles.userIsInRole(userId, roles)) {
      throw new Meteor.Error('unauthorized', `You must be one of the following roles: ${roles}`);
    }
    return true;
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/verification
 * @type {api/verification.VerificationRequestCollection}
 */
export const VerificationRequests = new VerificationRequestCollection();
