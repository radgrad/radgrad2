import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { ProfileInternshipDefine } from '../../../typings/radgrad';
import BaseCollection from '../../base/BaseCollection';
import { Internships } from '../../internship/InternshipCollection';
import { ROLE } from '../../role/Role';
import { Users } from '../UserCollection';

class ProfileInternshipCollection extends BaseCollection {
  constructor() {
    super(
      'ProfileInternship',
      new SimpleSchema({
        internshipID: SimpleSchema.RegEx.Id,
        userID: SimpleSchema.RegEx.Id,
        retired: { type: Boolean, optional: true },
      }),
    );
  }

  /**
   * Defines a new ProfileInternship.
   * @param internship the internship guid.
   * @param student the student's username.
   * @param retired the retired status.
   * @returns {void|*|boolean|{}}
   */
  define({ internship, username, retired = false }): string {
    return '';
  }

  /**
   * Updates the retired status.
   * @param docID the ID of the ProfileInternship.
   * @param retired the new retired value.
   */
  update(docID, { retired }: { retired?: boolean }) {}

  /**
   * Remove the ProfileInternship.
   * @param docID The docID of the ProfileInternship.
   */
  removeIt(docID) {
    return true;
  }

  /**
   * Removes all the ProfileInternships for the user.
   * @param user the username.
   */
  removeUser(user) {
    const userID = Users.getID(user);
    this.collection.remove({ userID });
  }

  /**
   * Publish ProfileInternships. If logged in as ADMIN get all, otherwise only get the ProfileInternships for the
   * userID.
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
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks internshipID, and userID.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find()
      .forEach(doc => {
        if (!Internships.isDefined(doc.internshipID)) {
          problems.push(`Bad internshipID: ${doc.internshipID}`);
        }
        if (!Users.isDefined(doc.userID)) {
          problems.push(`Bad userID: ${doc.userID}`);
        }
      });
    return problems;
  }

  /**
   * Returns an object representing the ProfileInternship with given docID in a format acceptable to define().
   * @param docID the docID of a ProfileInternship
   * @returns {ProfileInternshipDefine}
   */
  dumpOne(docID): ProfileInternshipDefine {
    const doc = this.findDoc(docID);
    const internship = Internships.findDoc(doc.internshipID).guid;
    const username = Users.getProfile(doc.userID).username;
    const retired = doc.retired;
    return { internship, username, retired };
  }

}

export const ProfileInternships = new ProfileInternshipCollection();
