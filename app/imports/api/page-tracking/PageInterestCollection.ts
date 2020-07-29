import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';
import { IPageInterest, IPageInterestDefine } from '../../typings/radgrad';
import { Users } from '../user/UserCollection';
import { PageInterestsCategoryTypes } from './PageInterestsCategoryTypes';
import { Slugs } from '../slug/SlugCollection';

/**
 * Represents a student's interest view for a specific topic category page
 * The different topic categories that a page could be are Career Goal, Course, Interest, and Opportunity
 * Definition of a student's interest view when they visit a page
 * 1. When they Favorite that page and don't unfavorite it before leaving the page
 * 2. They play the Teaser video at that page or open it as an external link
 * 3. They click an external link in the DESCRIPTION of that page
 *    - Profile Pictures and the interests tags do not count
 * 4. They spend a minimum of 5 seconds viewing that page
 *    - They have to be "focused" on that page in the browser sense
 * @extends api/base.BaseCollection
 * @memberOf api/analytic
 */
class PageInterestCollection extends BaseCollection {

  /**
   * Creates the PageInterestCollection
   */
  constructor() {
    super('PageInterest', new SimpleSchema({
      username: String,
      category: String,
      name: String,
      timestamp: Date,
      retired: { type: Boolean, optional: true },
    }));
    if (Meteor.isServer) {
      this.collection.rawCollection().createIndex({ timestamp: -1 });
    }
  }

  /**
   * Defines a snapshot of a page's student interest views
   * @param termID The ID of the academic term that this snapshot represents
   * @param category The topic category that this snapshot represents
   * @param name The name that the page represents
   * @param timestamp Timestamp of when this snapshot was recorded
   * @param retired boolean optional defaults to false.
   */
  public define({ username, category, name, timestamp = moment().toDate(), retired = false }: IPageInterestDefine): string {
    // Duplicates are not allowed
    // 1) Documents with the same values for all its fields
    let doc: IPageInterest;
    doc = this.collection.findOne({ username, category, name, timestamp, retired });
    if (doc) {
      return doc._id;
    }
    // 2) Documents with the same values for all its fields except timestamp
    // PageInterests only publishes PageInterests within the past 24 hours for the purpose of not defining more than 1
    // PageInterest for an item within that 24 hour period.
    doc = this.collection.findOne({ username, category, name, retired });
    if (doc) {
      return doc._id;
    }
    return this.collection.insert({ username, category, name, timestamp, retired });
  }

  /**
   * Removes all page interest documents from referenced user.
   * @param username The username of user to be removed.
   * @throws { Meteor.Error } If user is not an ID or username.
   */
  public removeUser(username: string) {
    this.collection.remove({ username });
  }

  /**
   * Asserts that the userID belongs to an admin role when running the find and removeUser method within this class.
   * @param userId The userId of the logged in user.
   */
  public assertAdminRoleForMethod(userId: string) {
    this.assertRole(userId, [ROLE.ADMIN]);
  }

  /**
   * Asserts that the userID belongs to a valid role when running the define method within this class.
   * @param userId The userId of the logged in user.
   */
  public assertValidRoleForMethod(userId: string) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.STUDENT]);
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks username, category, and name
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity(): string[] {
    const problems = [];
    this.find().forEach((doc) => {
      if (!Users.isDefined(doc.username)) {
        problems.push(`Bad user: ${doc.username}`);
      }
      const categories = Object.values(PageInterestsCategoryTypes);
      if (categories.indexOf(doc.category) < 0) {
        problems.push(`Bad category: ${doc.category}`);
      }
      if (!Slugs.isDefined(doc.name)) {
        problems.push(`Bad slug: ${doc.name}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the PageInterest docID in a format acceptable to define().
   * @param docID The docID of a PageInterest
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): IPageInterestDefine {
    const doc: IPageInterest = this.findDoc(docID);
    const username = doc.username;
    const category = doc.category;
    const name = doc.name;
    const timestamp = doc.timestamp;
    const retired = doc.retired;
    return { username, category, name, timestamp, retired };
  }

  /**
   * Publish an empty cursor to PageInterests. Since method calls are used to find interactions,
   * we do not need to publish any records, but would still like this to be on the list of collections
   * for integrity check, etc.
   */
  public publish() {
    if (Meteor.isServer) {
      const instance = this;
      Meteor.publishLite(this.collectionName, function filterStudentID(studentID) {
        if (_.isNil(studentID)) {
          return this.ready();
        }
        const profile = Users.getProfile(studentID);
        if (_.includes([ROLE.STUDENT], profile.role)) {
          const username = profile.username;

          // Only expose PageInterests for the past 24 hours
          const yesterday = moment().subtract(24, 'hours').toDate();
          return instance.collection.find({ username, timestamp: { $gte: yesterday } });
        }
        // Don't publish any documents
        return instance.collection.find({}, { skip: instance.collection.find({}).count() });
      });
    }
  }
}

export const PageInterests = new PageInterestCollection();
