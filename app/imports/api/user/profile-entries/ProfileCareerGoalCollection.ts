import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';
import { ProfileCareerGoalsForecastName } from '../../../startup/both/names';
import BaseCollection from '../../base/BaseCollection';
import { CareerGoals } from '../../career/CareerGoalCollection';
import { Users } from '../UserCollection';
import { ProfileCareerGoalDefine, ProfileEntryUpdate } from '../../../typings/radgrad';
import { ROLE } from '../../role/Role';

class ProfileCareerGoalCollection extends BaseCollection {
  public readonly publicationNames: {
    forecast: string;
  };

  /** Creates the ProfileCareerGoal collection */
  constructor() {
    super('ProfileCareerGoal', new SimpleSchema({
      careerGoalID: SimpleSchema.RegEx.Id,
      userID: SimpleSchema.RegEx.Id,
      share: Boolean,
      retired: { type: Boolean, optional: true },
    }));
    this.publicationNames = {
      forecast: `${this.collectionName}.forecast`,
    };
  }

  /**
   * Defines a new ProfileCareerGoal.
   * @param careerGoal the careerGoal slug.
   * @param username the user's username.
   * @param share {Boolean} share the career goal? Defaults to false.
   * @param retired the retired status.
   * @returns {void|*|boolean|{}}
   */
  define({ careerGoal, username, share = false, retired = false }: ProfileCareerGoalDefine) {
    // console.log(`ProfileCareerGoal.define ${careerGoal}, ${username}, ${share}, ${retired}`);
    const careerGoalID = CareerGoals.getID(careerGoal);
    const userID = Users.getID(username);
    const doc = this.collection.findOne({ userID, careerGoalID });
    if (doc) {
      return doc._id;
    }
    return this.collection.insert({ careerGoalID, userID, share, retired });
  }

  /**
   * Updates the retired status.
   * @param docID the ID of the ProfileCareerGoal.
   * @param retired the new retired value.
   */
  update(docID, { share, retired }: { share?: boolean, retired?: boolean }) {
    this.assertDefined(docID);
    const updateData: ProfileEntryUpdate = {};
    if (_.isBoolean(share)) {
      updateData.share = share;
    }
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
  removeUser(user) {
    const userID = Users.getID(user);
    this.collection.remove({ userID });
  }

  /**
   * Publish ProfileCareerGoals. If logged in as ADMIN get all, otherwise only get the ProfileCareerGoals for the
   * userID.
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
        if (_.includes([ROLE.ADMIN, ROLE.ADVISOR], profile.role)) {
          return collection.find();
        }
        return collection.find({ userID });
      });
      Meteor.publish(this.publicationNames.forecast, function publishCareerGoalForecast() {
        ReactiveAggregate(this, collection, [
          {
            $group: {
              _id: '$careerGoalID',
              count: { $sum: 1 },
            },
          },
          { $project: { count: 1, careerGoalID: 1 } },
        ], { clientCollection: ProfileCareerGoalsForecastName });
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
    const share = doc.share;
    const retired = doc.retired;
    return { careerGoal, username, share, retired };
  }

}

export const ProfileCareerGoals = new ProfileCareerGoalCollection();
