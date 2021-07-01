import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';
import { UserInteractionDefine } from '../../typings/radgrad';

export enum USER_INTERACTIONS {
  LOGIN = 'login',
  CHANGE_OUTLOOK = 'change-outlook',
  EXPLORE = 'explore',
  PLAN = 'plan',
  VERIFY = 'verify',
  REVIEW = 'review',
  LEVEL_UP = 'level-up',
  COMPLETE_PLAN = 'complete-plan',
  CHANGE_VISIBILITY = 'change-visibility',
}

/** Provide short documentation string for each User Interaction behavior. */
export const USER_INTERACTION_DESCRIPTIONS = {};
USER_INTERACTION_DESCRIPTIONS[USER_INTERACTIONS.LOGIN] = 'Visit to any page.';
USER_INTERACTION_DESCRIPTIONS[USER_INTERACTIONS.CHANGE_OUTLOOK] = 'Change to profile regarding Interests, Career Goals, Courses, or Opportunities.';
USER_INTERACTION_DESCRIPTIONS[USER_INTERACTIONS.EXPLORE] = 'Visit to any Explorer pages.';
USER_INTERACTION_DESCRIPTIONS[USER_INTERACTIONS.PLAN] = 'Visit to the Degree Planner page.';
USER_INTERACTION_DESCRIPTIONS[USER_INTERACTIONS.VERIFY] = 'Submission of a Verification Request';
USER_INTERACTION_DESCRIPTIONS[USER_INTERACTIONS.REVIEW] = 'Submission of a Review';
USER_INTERACTION_DESCRIPTIONS[USER_INTERACTIONS.LEVEL_UP] = 'Change in Level.';
USER_INTERACTION_DESCRIPTIONS[USER_INTERACTIONS.COMPLETE_PLAN] = 'Degree Plan achieves 100 planned points in Innovation, Competency, and Experience.';
USER_INTERACTION_DESCRIPTIONS[USER_INTERACTIONS.CHANGE_VISIBILITY] = 'Change to visibility settings';


/**
 * Represents a log of user interactions with RadGrad.
 * There should be only one user interaction document of a given type for a given user on a given day.
 * @extends api/base.BaseCollection
 * @memberOf api/user-interaction
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
      day: { type: String }, // YYYY-MM-DD format, created from timestamp, simplifies querying.
    }));
    if (Meteor.isServer) {
      this.collection.rawCollection().createIndex({ username: 1, type: 1, day: 1 });
    }
  }

  /**
   * Defines a user interaction record.
   * Returns an existing one if the username, type, and timestamp all match exactly.
   * @param username The username.
   * @param type The interaction type.
   * @param typeData Optional. Any data associated with the interaction type. Defaults to [].
   * @param timestamp Optional. The time of interaction. Defaults to right now.
   */
  public define({ username, type, typeData = [], timestamp = moment().toDate() }: UserInteractionDefine): string {
    const doc = this.collection.findOne({ username, type, typeData, timestamp });
    if (doc) {
      return doc._id;
    }
    const day = moment(timestamp).format(moment.HTML5_FMT.DATE); // Produces YYYY-MM-DD.
    return this.collection.insert({ username, type, typeData, timestamp, day });
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
    // CAM: We no longer validate the users in the UserInteractions since we now remove users.
    return problems;
  }

  /**
   * Returns an object representing the UserInteraction docID in a format acceptable to define().
   * @param docID The docID of a UserInteraction.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): UserInteractionDefine {
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
 * @memberOf api/user-interaction
 */
export const UserInteractions = new UserInteractionCollection();
