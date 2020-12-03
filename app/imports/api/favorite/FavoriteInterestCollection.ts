import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';
import BaseCollection from '../base/BaseCollection';
import { Interests } from '../interest/InterestCollection';
import { Users } from '../user/UserCollection';
import { ROLE } from '../role/Role';
import { IFavoriteInterestDefine, IFavoriteUpdate } from '../../typings/radgrad';

class FavoriteInterestCollection extends BaseCollection {
  public readonly publicationNames: {
    scoreboard: string;
  }

  /** Creates the FavoriteInterest collection */
  constructor() {
    super('FavoriteInterest', new SimpleSchema({
      interestID: SimpleSchema.RegEx.Id,
      userID: SimpleSchema.RegEx.Id,
      share: Boolean,
      retired: { type: Boolean, optional: true },
    }));
    this.publicationNames = {
      scoreboard: `${this.collectionName}.scoreboard`,
    };
  }

  /**
   * Defines a new FavoriteInterest.
   * @param interest the interest slug.
   * @param student the student's username.
   * @param share {Boolean}, is the interest to be shared? Defaults to false.
   * @param retired the retired status.
   * @returns {void|*|boolean|{}}
   */
  define({ interest, username, share = false, retired = false }) {
    const interestID = Interests.getID(interest);
    const userID = Users.getID(username);
    const doc = this.collection.findOne({ userID, interestID });
    if (doc) {
      return doc._id;
    }
    return this.collection.insert({ interestID, userID, share, retired });
  }

  /**
   * Updates the retired status.
   * @param docID the ID of the FavoriteInterest.
   * @param retired the new retired value.
   */
  update(docID, { share, retired }: { share?: boolean, retired?: boolean }) {
    this.assertDefined(docID);
    const updateData: IFavoriteUpdate = {};
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    if (_.isBoolean(share)) {
      updateData.share = share;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Remove the FavoriteInterest.
   * @param docID The docID of the FavoriteInterest.
   */
  removeIt(docID) {
    this.assertDefined(docID);
    // OK, clear to delete.
    return super.removeIt(docID);
  }

  /**
   * Removes all the FavoriteInterests for the user.
   * @param user the username.
   */
  removeUser(user) {
    const userID = Users.getID(user);
    this.collection.remove({ userID });
  }

  /**
   * Publish InterestFavorites. If logged in as ADMIN get all, otherwise only get the InterestFavorites for the
   * studentID.
   * Also publishes the InterestFavorites scoreboard.
   */
  publish() {
    if (Meteor.isServer) {
      const collection = this.collection;
      Meteor.publish(this.collectionName, function filterStudentID(studentID) { // eslint-disable-line meteor/audit-argument-checks
        if (_.isNil(studentID)) {
          return this.ready();
        }
        const profile = Users.getProfile(studentID);
        if (_.includes([ROLE.ADMIN, ROLE.ADVISOR], profile.role)) {
          return collection.find();
        }
        return collection.find({
          $or: [
            { userID: studentID },
            { share: true },
          ],
        });
      });
      Meteor.publish(this.publicationNames.scoreboard, function publishInterestScoreboard() {
        ReactiveAggregate(this, collection, [
          {
            $group: {
              _id: '$interestID',
              count: { $sum: 1 },
            },
          },
          { $project: { count: 1, interestID: 1 } },
        ], { clientCollection: 'InterestFavoritesScoreboard' });
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
   * Returns the Interest associated with the FavoriteInterest with the given instanceID.
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
   * Returns the Interest slug for the favorite's corresponding Interest.
   * @param instanceID The FavoriteInterest ID.
   * @return {string} The interest slug.
   */
  getInterestSlug(instanceID) {
    this.assertDefined(instanceID);
    const instance = this.collection.findOne({ _id: instanceID });
    return Interests.findSlugByID(instance.interestID);
  }

  /**
   * Returns the Student profile associated with the FavoriteInterest with the given instanceID.
   * @param instanceID The ID of the FavoriteInterest.
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
   * @param instanceID the FavoriteInterest id.
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
   * Returns an object representing the FavoriteInterest with given docID in a format acceptable to define().
   * @param docID the docID of a FavoriteInterest
   * @returns {IFavoriteInterestDefine}
   */
  dumpOne(docID): IFavoriteInterestDefine {
    const doc = this.findDoc(docID);
    const interest = Interests.findSlugByID(doc.interestID);
    const username = Users.getProfile(doc.userID).username;
    const share = doc.share;
    const retired = doc.retired;
    return { interest, username, share, retired };
  }
}

export const FavoriteInterests = new FavoriteInterestCollection();
