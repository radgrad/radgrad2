import { Meteor } from 'meteor/meteor';
import { moment } from 'meteor/momentjs:moment';
import SimpleSchema from 'simpl-schema';
import * as _ from 'lodash';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';
import { Users } from '../user/UserCollection';
import { IAdvisorLogDefine, IAdvisorLogUpdate } from '../../typings/radgrad'; // eslint-disable-line

/**
 * Represents a log of an Advisor talking to a Student.
 * @extends api/base.BaseCollection
 * @memberOf api/log
 */
class AdvisorLogCollection extends BaseCollection {

  /**
   * Creates the AdvisorLog collection.
   */
  constructor() {
    super('AdvisorLog', new SimpleSchema({
      studentID: { type: SimpleSchema.RegEx.Id },
      advisorID: { type: SimpleSchema.RegEx.Id },
      text: { type: String },
      createdOn: { type: Date },
      retired: { type: Boolean, optional: true },
    }));
    this.defineSchema = new SimpleSchema({
      advisor: String,
      student: String,
      text: String,
    });
    this.updateSchema = new SimpleSchema({
      text: { type: String, optional: true },
      retired: { type: Boolean, optional: true },
    });
  }

  /**
   * Defines an advisor log record.
   * @example
   * AdvisorLogs.define({
   *                      advisor: 'glau',
   *                      student: 'abi@hawaii.edu',
   *                      text: 'Talked about changing academic plan to B.S. CS from B.A. ICS.',
   *                      });
   * @param advisor The advisor's username.
   * @param student The student's username.
   * @param text The contents of the session.
   */
  public define({ advisor, student, text, createdOn = moment().toDate(), retired = false }: IAdvisorLogDefine) {
    const advisorID = Users.getID(advisor);
    const studentID = Users.getID(student);
    return this.collection.insert({ advisorID, studentID, text, createdOn, retired });
  }

  public update(docID: string, { text, retired }: IAdvisorLogUpdate) {
    this.assertDefined(docID);
    // console.log('update(%o, %o)', docID, text);
    const updateData: IAdvisorLogUpdate = {};
    if (text) {
      updateData.text = text;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Removes all AdvisorLog documents referring to (the student) user.
   * @param user The student user, either the ID or the username.
   * @throws { Meteor.Error } If user is not an ID or username.
   */
  public removeUser(user: string) {
    const studentID = Users.getID(user);
    this.collection.remove({ studentID });
  }

  /**
   * Returns the Advisor associated with the log instance.
   * @param instanceID the instance ID.
   * @returns {Object}
   */
  public getAdvisorDoc(instanceID: string) {
    this.assertDefined(instanceID);
    const instance = this.findDoc(instanceID);
    return Users.getProfile(instance.advisorID);
  }

  /**
   * Returns the Student associated with the log instance.
   * @param instanceID the instance ID.
   * @returns {Object}
   */
  public getStudentDoc(instanceID: string) {
    this.assertDefined(instanceID);
    const instance = this.findDoc(instanceID);
    return Users.getProfile(instance.studentID);
  }

  /**
   * Depending on the logged in user publish only their AdvisorLogs. If
   * the user is in the Role.ADMIN or Role.ADVISOR then publish all AdvisorLogs.
   */
  public publish() {
    if (Meteor.isServer) {
      const instance = this;
      // eslint-disable-next-line meteor/audit-argument-checks
      Meteor.publish(this.collectionName, function publish(studentID) {
        if (!this.userId) { // https://github.com/meteor/meteor/issues/9619
          return this.ready();
        }
        if (!studentID) {
          return this.ready();
        }
        const profile = Users.getProfile(this.userId);
        if (profile.role === ROLE.ADMIN) {
          return instance.collection.find();
        }
        if (profile.role === ROLE.ADVISOR) {
          return instance.collection.find({ retired: { $not: { $eq: true } } });
        }
        return instance.collection.find({ studentID, retired: { $not: { $eq: true } } });
      });
    }
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks studentID, advisorID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity() {
    const problems = [];
    this.find().forEach((doc) => {
      if (!Users.isDefined(doc.studentID)) {
        problems.push(`Bad studentID: ${doc.studentID}`);
      }
      if (!Users.isDefined(doc.advisorID)) {
        problems.push(`Bad advisorID: ${doc.advisorID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the Log docID in a format acceptable to define().
   * @param docID The docID of a Log.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): IAdvisorLogDefine {
    const doc = this.findDoc(docID);
    const student = Users.getProfile(doc.studentID).username;
    const advisor = Users.getProfile(doc.advisorID).username;
    const text = doc.text;
    const createdOn = doc.createdOn;
    const retired = doc.retired;
    return { student, advisor, text, createdOn, retired };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/log.AdvisorLogCollection}
 * @memberOf api/log
 */
export const AdvisorLogs = new AdvisorLogCollection();
