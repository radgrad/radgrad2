import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { Opportunities } from './OpportunityCollection';
import { ROLE } from '../role/Role';
import { AcademicYearInstances } from '../degree-plan/AcademicYearInstanceCollection';
import { Semesters } from '../semester/SemesterCollection';
import { Users } from '../user/UserCollection';
import BaseCollection from '../base/BaseCollection';

/**
 * OpportunityInstances indicate that a student wants to take advantage of an Opportunity in a specific semester.
 * @extends api/base.BaseCollection
 * @memberOf api/opportunity
 */
class OpportunityInstanceCollection extends BaseCollection {
  public publicationNames: { student: string; perStudentAndSemester: string; studentID: string; };

  /**
   * Creates the OpportunityInstance collection.
   */
  constructor() {
    super('OpportunityInstance', new SimpleSchema({
      semesterID: { type: SimpleSchema.RegEx.Id },
      opportunityID: { type: SimpleSchema.RegEx.Id },
      verified: { type: Boolean },
      studentID: { type: SimpleSchema.RegEx.Id },
      sponsorID: { type: SimpleSchema.RegEx.Id },
      ice: { type: Object, optional: true, blackbox: true },
    }));
    this.publicationNames = {
      student: this.collectionName,
      perStudentAndSemester: `${this.collectionName}.PerStudentAndSemester`,
      studentID: `${this.collectionName}.studentID`,
    };
    if (Meteor.isServer) {
      this.collection._ensureIndex({ _id: 1, studentID: 1, semesterID: 1 });
    }
  }

  /**
   * Defines a new OpportunityInstance.
   * @example
   * OpportunityInstances.define({ semester: 'Fall-2015',
   *                               opportunity: 'hack2015',
   *                               verified: false,
   *                               student: 'joesmith',
   *                              sponsor: 'johnson' });
   * @param { Object } description Semester, opportunity, and student must be slugs or IDs. Verified defaults to false.
   * Sponsor defaults to the opportunity sponsor.
   * Note that only one opportunity instance can be defined for a given semester, opportunity, and student.
   * @throws {Meteor.Error} If semester, opportunity, or student cannot be resolved, or if verified is not a boolean.
   * @returns The newly created docID.
   */

  public define({ semester, opportunity, sponsor, verified = false, student }: IOpportunityInstanceDefine) {
    // Validate semester, opportunity, verified, and studentID
    const semesterID = Semesters.getID(semester);
    const semesterDoc = Semesters.findDoc(semesterID);
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
    if (semesterDoc.term === Semesters.SPRING || semesterDoc.term === Semesters.SUMMER) {
      AcademicYearInstances.define({ year: semesterDoc.year - 1, student: studentProfile.username });
    } else {
      AcademicYearInstances.define({ year: semesterDoc.year, student: studentProfile.username });
    }
    if ((typeof verified) !== 'boolean') {
      throw new Meteor.Error(`${verified} is not a boolean.`);
    }
    if (this.isOpportunityInstance(semester, opportunity, student)) {
      return this.findOpportunityInstanceDoc(semester, opportunity, student)._id;
    }
    const ice = Opportunities.findDoc(opportunityID).ice;
    // Define and return the new OpportunityInstance
    const opportunityInstanceID = this.collection.insert({ semesterID, opportunityID, verified, studentID, sponsorID, ice });
    return opportunityInstanceID;
  }

  /**
   * Update the opportunity instance. Only verified and ICE fields can be updated.
   * @param docID The course instance docID (required).
   * @param semesterID the semesterID for the course instance optional.
   * @param verified boolean optional.
   * @param ice an object with fields i, c, e (optional)
   */
  public update(docID: string, { semesterID, verified, ice }: IOpportunityInstanceUpdate) {
    this.assertDefined(docID);
    const updateData: IOpportunityInstanceUpdate = {};
    if (semesterID) {
      updateData.semesterID = semesterID;
    }
    if (_.isBoolean(verified)) {
      updateData.verified = verified;
    }
    if (ice) {
      updateData.ice = ice;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the opportunity instance.
   * @param docID The docID of the opportunity instance.
   */
  public removeIt(docID: string) {
    this.assertDefined(docID);
    // OK, clear to delete.
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
    this.assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT]);
  }

  /**
   * Returns the opportunityInstance document associated with semester, opportunity, and student.
   * @param semester The semester (slug or ID).
   * @param opportunity The opportunity (slug or ID).
   * @param student The student (slug or ID)
   * @returns { Object } Returns the document or null if not found.
   * @throws { Meteor.Error } If semester, opportunity, or student does not exist.
   */
  public findOpportunityInstanceDoc(semester: string, opportunity: string, student: string) {
    const semesterID = Semesters.getID(semester);
    const studentID = Users.getID(student);
    const opportunityID = Opportunities.getID(opportunity);
    return this.collection.findOne({ semesterID, studentID, opportunityID });
  }

  /**
   * Returns true if there exists an OpportunityInstance for the given semester, opportunity, and student.
   * @param semester The semester (slug or ID).
   * @param opportunity The opportunity (slug or ID).
   * @param student The student (slug or ID).
   * @returns True if the opportunity instance exists.
   * @throws { Meteor.Error } If semester, opportunity, or student does not exist.
   */
  public isOpportunityInstance(semester: string, opportunity: string, student: string) {
    return !!this.findOpportunityInstanceDoc(semester, opportunity, student);
  }

  /**
   * Returns the Opportunity associated with the OpportunityInstance with the given instanceID.
   * @param instanceID The id of the OpportunityInstance.
   * @returns {Object} The associated Opportunity.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  public getOpportunityDoc(instanceID: string) {
    // this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return Opportunities.findDoc(instance.opportunityID);
  }

  /**
   * Returns the Semester associated with the OpportunityInstance with the given instanceID.
   * @param instanceID The id of the OpportunityInstance.
   * @returns {Object} The associated Semester.
   * @throws {Meteor.Error} If instanceID is not a valid ID.
   */
  public getSemesterDoc(instanceID: string) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return Semesters.findDoc(instance.semesterID);
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
   * Depending on the logged in user publish only their OpportunityInstances. If
   * the user is in the Role.ADMIN then publish all OpportunityInstances.
   */
  public publish() {
    if (Meteor.isServer) {
      // tslint:disable-next-line: no-this-assignment
      const instance = this;
      Meteor.publish(this.publicationNames.student, function publish() {
        if (!this.userId) {  // https://github.com/meteor/meteor/issues/9619
          return this.ready();
        }
        if (Roles.userIsInRole(this.userId, [ROLE.ADMIN, ROLE.ADVISOR])) {
          return instance.collection.find();
        }
        if (Roles.userIsInRole(this.userId, [ROLE.STUDENT])) {
          return instance.collection.find({ studentID: this.userId });
        }
        return instance.collection.find({ sponsorID: this.userId });
      });
      Meteor.publish(this.publicationNames.perStudentAndSemester, (studentID: string, semesterID: string) => {
        new SimpleSchema({
          studentID: { type: String },
          semesterID: { type: String },
        }).validate({ studentID, semesterID });
        return instance.collection.find({ studentID, semesterID });
      });
      Meteor.publish(this.publicationNames.studentID, (studentID) => {
        new SimpleSchema({
          studentID: { type: String },
        }).validate({ studentID });
        return instance.collection.find({ studentID });
      });
    }
  }

  /**
   * @returns {String} This opportunity instance, formatted as a string.
   * @param opportunityInstanceID The opportunity instance ID.
   * @throws {Meteor.Error} If not a valid ID.
   */
  public toString(opportunityInstanceID: string) {
    this.assertDefined(opportunityInstanceID);
    const opportunityInstanceDoc = this.findDoc(opportunityInstanceID);
    const semester = Semesters.toString(opportunityInstanceDoc.semesterID);
    const opportunityName = Opportunities.findDoc(opportunityInstanceDoc.opportunityID).name;
    return `[OI ${semester} ${opportunityName}]`;
  }

  /**
   * Updates the OpportunityInstance's Semester.
   * @param opportunityInstanceID The opportunity instance ID.
   * @param semesterID The semester id.
   * @throws {Meteor.Error} If not a valid ID.
   */
  public updateSemester(opportunityInstanceID: string, semesterID: string) {
    this.assertDefined(opportunityInstanceID);
    Semesters.assertSemester(semesterID);
    this.collection.update({ _id: opportunityInstanceID }, { $set: { semesterID } });
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
   * Checks semesterID, opportunityID, studentID
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity() {
    const problems = [];
    this.find().forEach((doc) => {
      if (!Semesters.isDefined(doc.semesterID)) {
        problems.push(`Bad semesterID: ${doc.semesterID}`);
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
    });
    return problems;
  }

  /**
   * Returns an object representing the OpportunityInstance docID in a format acceptable to define().
   * @param docID The docID of an OpportunityInstance.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): IOpportunityInstanceDefine {
    const doc = this.findDoc(docID);
    const semester = Semesters.findSlugByID(doc.semesterID);
    const opportunity = Opportunities.findSlugByID(doc.opportunityID);
    const verified = doc.verified;
    const student = Users.getProfile(doc.studentID).username;
    const sponsor = Users.getProfile(doc.sponsorID).username;
    return { semester, opportunity, verified, student, sponsor };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/opportunity.OpportunityInstanceCollection}
 * @memberOf api/opportunity
 */
export const OpportunityInstances = new OpportunityInstanceCollection();
