import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import moment from 'moment';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { ROLE } from '../role/Role';
import { Users } from '../user/UserCollection';
import BaseCollection from '../base/BaseCollection';
import { AcademicYearInstanceDefine } from '../../typings/radgrad';
import { RadGradProperties } from '../radgrad/RadGradProperties';

/**
 * Each AcademicYearInstance represents a sequence of three or four academic terms for a given student.
 * It is used to control the display of academic terms for a given student in the Degree Planner.
 * @extends api/base.BaseCollection
 * @memberOf api/degree-plan
 */
class AcademicYearInstanceCollection extends BaseCollection {
  /**
   * Creates the AcademicYearInstance collection.
   */
  constructor() {
    super('AcademicYearInstance', new SimpleSchema({
      year: { type: Number },
      springYear: { type: Number },
      studentID: { type: SimpleSchema.RegEx.Id },
      termIDs: [SimpleSchema.RegEx.Id],
      retired: { type: Boolean, optional: true },
    }));
    if (Meteor.isServer) {
      this.collection.rawCollection().createIndex({ studentID: 1, year: 1 });
    }
    this.defineSchema = new SimpleSchema({
      year: {
        type: SimpleSchema.Integer,
        min: moment().year() - 5,
        max: moment().year() + 10,
        defaultValue: moment().year(),
      },
      student: String,
    });
    // year?: number; springYear?: number; studentID?: string; termIDs?: string[];
    this.updateSchema = new SimpleSchema({
      year: { type: SimpleSchema.Integer, min: moment().year() - 10, max: moment().year() + 10, optional: true },
      retired: { type: Boolean, optional: true },
    });
  }

  /**
   * Defines a new AcademicYearInstance.
   * @example
   * To define the 2016 - 2017 academic year for Joe Smith.
   *     AcademicYearInstances.define({ year: 2016,
   *                                    student: 'joesmith' });
   * @param { Object } Object with keys year and student.
   * @throws {Meteor.Error} If the definition includes an undefined student or a year that is out of bounds.
   * @returns The newly created docID.
   */
  public define({ year, student }: AcademicYearInstanceDefine) {
    const studentID = Users.getID(student);
    const quarterSystem = RadGradProperties.getQuarterSystem();
    let termIDs = [];
    // check for gaps
    const prevYears = this.collection.find({ year: { $lt: year }, studentID }, { sort: { year: 1 } }).fetch();
    if (prevYears.length > 0) {
      const lastYear = prevYears[prevYears.length - 1].year;
      for (let y = lastYear + 1; y < year; y++) {
        if (this.collection.find({ year: y, studentID }).fetch().length === 0) {
          termIDs = [];
          termIDs.push(AcademicTerms.getID(`${AcademicTerms.FALL}-${y}`));
          if (quarterSystem) {
            termIDs.push(AcademicTerms.getID(`${AcademicTerms.WINTER}-${y + 1}`));
          }
          termIDs.push(AcademicTerms.getID(`${AcademicTerms.SPRING}-${y + 1}`));
          termIDs.push(AcademicTerms.getID(`${AcademicTerms.SUMMER}-${y + 1}`));
          this.collection.insert({ year: y, springYear: y + 1, studentID, termIDs });
        }
      }
    }
    const nextYears = this.collection.find({ year: { $gt: year }, studentID }, { sort: { year: 1 } }).fetch();
    if (nextYears.length > 0) {
      const nextYear = nextYears[0].year;
      for (let y = year + 1; y < nextYear; y++) {
        if (this.collection.find({ year: y, studentID }).fetch().length === 0) {
          termIDs = [];
          termIDs.push(AcademicTerms.getID(`${AcademicTerms.FALL}-${y}`));
          if (quarterSystem) {
            termIDs.push(AcademicTerms.getID(`${AcademicTerms.WINTER}-${y + 1}`));
          }
          termIDs.push(AcademicTerms.getID(`${AcademicTerms.SPRING}-${y + 1}`));
          termIDs.push(AcademicTerms.getID(`${AcademicTerms.SUMMER}-${y + 1}`));
          this.collection.insert({ year: y, springYear: y + 1, studentID, termIDs });
        }
      }
    }
    const doc = this.collection.find({ year, studentID }).fetch();
    if (doc.length > 0) {
      return doc[0]._id;
    }
    termIDs = [];
    termIDs.push(AcademicTerms.getID(`${AcademicTerms.FALL}-${year}`));
    if (quarterSystem) {
      termIDs.push(AcademicTerms.getID(`${AcademicTerms.WINTER}-${year + 1}`));
    }
    termIDs.push(AcademicTerms.getID(`${AcademicTerms.SPRING}-${year + 1}`));
    termIDs.push(AcademicTerms.getID(`${AcademicTerms.SUMMER}-${year + 1}`));

    // Define and return the docID
    return this.collection.insert({ year, springYear: year + 1, studentID, termIDs });
  }

  /**
   * Update an AcademicYear.
   * @param docID The docID associated with this academic year.
   * @param year the fall year.
   * @param springYear the spring year
   * @param studentID the student's ID.
   * @param termIDs the 3 or 4 academic terms in the year.
   */
  public update(docID: string, { year, retired }:
  { year?: number; springYear?: number; studentID?: string; termIDs?: string[]; retired?: boolean }) {
    this.assertDefined(docID);
    const termIDs = [];
    const updateData: { year?: number; springYear?: number; termIDs?: string[]; retired?: boolean } = {};
    if (_.isNumber(year)) {
      updateData.year = year;
      updateData.springYear = year + 1;
      termIDs.push(AcademicTerms.getID(`${AcademicTerms.FALL}-${year}`));
      if (RadGradProperties.getQuarterSystem()) {
        termIDs.push(AcademicTerms.getID(`${AcademicTerms.WINTER}-${year + 1}`));
      }
      termIDs.push(AcademicTerms.getID(`${AcademicTerms.SPRING}-${year + 1}`));
      termIDs.push(AcademicTerms.getID(`${AcademicTerms.SUMMER}-${year + 1}`));
      updateData.termIDs = termIDs;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the academic year.
   * @param docID The docID of the academic year.
   */
  public removeIt(docID: string) {
    this.assertDefined(docID);
    // OK, clear to delete.
    return super.removeIt(docID);
  }

  /**
   * Removes all AcademicYearInstance documents referring to user.
   * @param user The student, either the ID or the username.
   * @throws { Meteor.Error } If user is not an ID or username.
   */
  public removeUser(user: string): void {
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
  public assertValidRoleForMethod(userId: string): void {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT]);
  }

  /**
   * Depending on the logged in user publish only their AcademicYears. If
   * the user is an Admin or Advisor then publish all AcademicYears.
   */
  public publish(): void {
    if (Meteor.isServer) {
      const collection = this.collection;
      Meteor.publish(this.collectionName, function filterStudentID(studentID) { // eslint-disable-line meteor/audit-argument-checks
        if (_.isNil(studentID)) {
          return this.ready();
        }
        const profile = Users.getProfile(studentID);
        if (profile.role === ROLE.ADMIN || Meteor.isAppTest) {
          return collection.find();
        }
        return collection.find({ studentID, retired: { $not: { $eq: true } } });
      });
    }
  }

  /**
   * @returns {String} A formatted string representing the academic year instance.
   * @param academicYearInstanceID The academic year instance ID.
   * @throws {Meteor.Error} If not a valid ID.
   */
  public toString(academicYearInstanceID: string): string {
    this.assertDefined(academicYearInstanceID);
    const doc = this.findDoc(academicYearInstanceID);
    const username = Users.getProfile(doc.studentID).username;
    return `[AY ${doc.year}-${doc.year + 1} ${username}]`;
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks studentID, termIDs
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity(): string[] {
    const problems = [];
    this.find().forEach((doc) => {
      if (!Users.isDefined(doc.studentID)) {
        problems.push(`Bad studentID: ${doc.studentID}`);
      }
      doc.termIDs.forEach((termID) => {
        if (!AcademicTerms.isDefined(termID)) {
          problems.push(`Bad termID: ${termID}`);
        }
      });
    });
    return problems;
  }

  /**
   * Returns an object representing the AcademicYearInstance docID in a format acceptable to define().
   * @param docID The docID of an AcademicYearInstance.
   * @returns { object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): AcademicYearInstanceDefine {
    const doc = this.findDoc(docID);
    const student = Users.getProfile(doc.studentID).username;
    const year = doc.year;
    return { student, year };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/degree-plan
 */
export const AcademicYearInstances = new AcademicYearInstanceCollection();
// We are not going to persist AcademicYearInstances
