import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { Users } from '../user/UserCollection';
import { ROLE } from '../role/Role';
import { IUserInteractionDefine } from '../../typings/radgrad';

/**
 * Represents a log of user interactions with RadGrad.
 * An interaction may be a profile update or a page visit, such as a student updating their
 * career goals, or visiting the degree planner.
 *
 * username is the username of the user that performed the interaction.
 * type is one of the following:
 *   pageView: the user is now visiting a page.  (typeData: path to page)
 *   login: the user has just logged in. (typeData: "N/A").
 *   interestIDs, careerGoalIDs, academicPlanIDs, declaredAcademicTermID, picture, website: user modifies fields.
 *   (typeData: shows the new set of IDs after the modification).
 *   addCourse, addOpportunity, removeCourse, removeOpportunity: user added/removed an instance
 * @extends api/base.BaseCollection
 * @memberOf api/analytic
 */
class UserInteractionCollection extends BaseCollection {

  /**
   * Creates the UserInteraction collection
   */
  constructor() {
    super('UserInteraction', new SimpleSchema({
      username: { type: String },
      type: { type: String },
      typeData: Array,
      'typeData.$': String,
      timestamp: { type: Date },
    }));
    if (Meteor.isServer) {
      this.collection.rawCollection().createIndex({ username: 1, type: 1 });
    }

  }

  /**
   * Defines a user interaction record.
   * @param username The username.
   * @param type The interaction type.
   * @param typeData Any data associated with the interaction type.
   * @param timestamp The time of interaction.
   */
  public define({ username, type, typeData, timestamp = moment().toDate() }: IUserInteractionDefine): string {
    const doc = this.collection.findOne({ username, type, typeData, timestamp });
    if (doc) {
      return doc._id;
    }
    return this.collection.insert({ username, type, typeData, timestamp });
  }

  /**
   * Removes all interaction documents from referenced user.
   * @param username The username of user to be removed.
   * @throws { Meteor.Error } If user is not an ID or username.
   */
  public removeUser(username: string) {
    this.collection.remove({ username });
  }

  /**
   * Asserts that the userID belongs to an admin role when running the find and removeUser method
   * within this class.
   * @param userId The userId of the logged in user.
   */
  public assertAdminRoleForMethod(userId: string) {
    this.assertRole(userId, [ROLE.ADMIN]);
  }

  /**
   * Asserts that the userID belongs to a valid role when running the define method
   * within this class.
   * @param userId The userId of the logged in user.
   */
  public assertValidRoleForMethod(userId: string) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.STUDENT, ROLE.ADVISOR, ROLE.FACULTY]);
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity(): string[] {
    const problems = [];
    this.find().forEach((doc) => {
      if (!Users.isDefined(doc.username)) {
        problems.push(`Bad user: ${doc.username}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the UserInteraction docID in a format acceptable to define().
   * @param docID The docID of a UserInteraction.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): IUserInteractionDefine {
    const doc = this.findDoc(docID);
    const username = doc.username;
    const timestamp = doc.timestamp;
    const type = doc.type;
    const typeData = doc.typeData;
    return { username, type, typeData, timestamp };
  }

  /**
   * Publish a cursor to UserInteractions. Method calls are used to find interactions and we do not subscribe to
   * UserInteractions on the client. However, we would still like this to be on the list of collections
   * for integrity check, etc.
   */
  public publish() {
    if (Meteor.isServer) {
      Meteor.publish(this.collectionName, () => this.collection.find());
    }
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @type {api/log.UserInteractionCollection}
 * @memberOf api/analytic
 */
export const UserInteractions = new UserInteractionCollection();
