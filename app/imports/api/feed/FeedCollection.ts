import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import moment from 'moment';
import { ROLE } from '../role/Role';
import { Courses } from '../course/CourseCollection';
import { Opportunities } from '../opportunity/OpportunityCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { Slugs } from '../slug/SlugCollection';
import { Users } from '../user/UserCollection';
import BaseCollection from '../base/BaseCollection';
import { IFeedDefine, IFeedUpdate } from '../../typings/radgrad';
import { defaultProfilePicture } from '../user/BaseProfileCollection';

/**
 * Returns the number of whole days between date a and b.
 * @param a The first date.
 * @param b The second date.
 * @returns {number} The number of days between a and b.
 * @memberOf api/feed
 */
function dateDiffInDays(a: string, b: string) {
  const ams = Date.parse(a);
  const bms = Date.parse(b);
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((ams - bms) / MS_PER_DAY);
}

/**
 * Returns true if the timestamp associated with feed is within a day of timestamp.
 * @param feed The feed.
 * @param timestamp A timestamp.
 * @returns {boolean} True if feed's timestamp is within a day of timestamp.
 * @memberOf api/feed
 */
function withinPastDay(feed: { timestamp: string }, timestamp: string) {
  const feedTime = feed.timestamp;
  const currentFeedTime = timestamp;
  const timeDiff = dateDiffInDays(currentFeedTime, feedTime);
  return (timeDiff === 0);
}

/**
 * Represents a feed instance.
 * @extends api/base.BaseCollection
 * @memberOf api/feed
 */
class FeedCollection extends BaseCollection {
  public NEW_USER: string;

  public NEW_COURSE: string;

  public NEW_OPPORTUNITY: string;

  public VERIFIED_OPPORTUNITY: string;

  public NEW_COURSE_REVIEW: string;

  public NEW_OPPORTUNITY_REVIEW: string;

  public NEW_LEVEL: string;

  /**
   * Creates the Feed collection.
   */
  constructor() {
    super('Feed', new SimpleSchema({
      feedType: String,
      description: String,
      timestamp: Date,
      picture: String,
      userIDs: { type: Array }, 'userIDs.$': SimpleSchema.RegEx.Id,
      opportunityID: { type: SimpleSchema.RegEx.Id, optional: true },
      courseID: { type: SimpleSchema.RegEx.Id, optional: true },
      termID: { type: SimpleSchema.RegEx.Id, optional: true },
      retired: { type: Boolean, optional: true },
    }));
    this.NEW_USER = 'new-user';
    this.NEW_COURSE = 'new-course';
    this.NEW_OPPORTUNITY = 'new-opportunity';
    this.VERIFIED_OPPORTUNITY = 'verified-opportunity';
    this.NEW_COURSE_REVIEW = 'new-course-review';
    this.NEW_OPPORTUNITY_REVIEW = 'new-opportunity-review';
    this.NEW_LEVEL = 'new-level';
    this.defineSchema = new SimpleSchema({
      user: { type: String, optional: true },
      course: { type: String, optional: true },
      opportunity: { type: String, optional: true },
      academicTerm: { type: String, optional: true },
      level: { type: SimpleSchema.Integer, min: 1, max: 6, optional: true },
      feedType: String,
      timestamp: { type: Date, optional: true },
    });
    this.updateSchema = new SimpleSchema({
      description: { type: String, optional: true },
      picture: { type: String, optional: true },
      userIDs: { type: Array, optional: true },
      'userIDs.$': String,
      opportunity: { type: String, optional: true },
      course: { type: String, optional: true },
      academicTerm: { type: String, optional: true },
      retired: { type: Boolean, optional: true },
    });
  }

  /**
   * Defines a new Feed instance.
   * @param feedDefinition An object representing the new Feed.
   * feedDefinition must have a field named 'feedType' which should be one of the following strings:
   * new-user, new-course, new-opportunity, new-verified-opportunity, new-course-review, or new-opportunity-review.
   * Based upon the feedType, the object should contain additional fields providing the information necessary to
   * define that new feed.
   */
  public define(feedDefinition: IFeedDefine) {
    if (feedDefinition.feedType === this.NEW_USER) {
      return this.defineNewUser(feedDefinition);
    }
    if (feedDefinition.feedType === this.NEW_COURSE) {
      return this.defineNewCourse(feedDefinition);
    }
    if (feedDefinition.feedType === this.NEW_OPPORTUNITY) {
      return this.defineNewOpportunity(feedDefinition);
    }
    if (feedDefinition.feedType === this.VERIFIED_OPPORTUNITY) {
      return this.defineNewVerifiedOpportunity(feedDefinition);
    }
    if (feedDefinition.feedType === this.NEW_COURSE_REVIEW) {
      return this.defineNewCourseReview(feedDefinition);
    }
    if (feedDefinition.feedType === this.NEW_OPPORTUNITY_REVIEW) {
      return this.defineNewOpportunityReview(feedDefinition);
    }
    if (feedDefinition.feedType === this.NEW_LEVEL) {
      return this.defineNewLevel(feedDefinition);
    }
    throw new Meteor.Error(`Unknown feed type: ${feedDefinition.feedType}`);
  }

  /**
   * Update a Feed instance
   * @param docID The docID to be updated.
   * Description, pictures, users, opportunity, course, and academicTerm can be updated.
   * The timestamp and feedtype fields cannot be updated once created.
   * @throws { Meteor.Error } If docID is not defined, or if users, opportunity, or course are not defined.
   */
  public update(docID: string, { description, picture, users, opportunity, course, academicTerm, retired }: IFeedUpdate) {
    this.assertDefined(docID);
    const updateData: { description?: string; picture?: string; userIDs?: string[]; opportunityID?: string; courseID?: string; termID?: string; retired?: boolean; } = {};
    if (description) {
      updateData.description = description;
    }
    if (picture) {
      updateData.picture = picture;
    }
    if (users) {
      const userIDs = Users.getIDs(users);
      updateData.userIDs = userIDs;
    }
    if (opportunity) {
      updateData.opportunityID = Opportunities.getID(opportunity);
    }
    if (course) {
      updateData.courseID = Courses.getID(course);
    }
    if (academicTerm) {
      updateData.termID = AcademicTerms.getID(academicTerm);
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Adds user to the Feed.  If there is no new-user feed within the past day, then a new Feed is created and its
   * docID is returned.
   * If there is a new-user feed within the past day, then this user is added to that Feed instance and its
   * docID is returned.
   * @example
   * Feeds._defineNewUser({ feedType: Feeds.NEW_USER,
   *                      user: 'abi@hawaii.edu',
   *                      timestamp: '12345465465' });
   * @param { Object } description Object with keys user and timestamp.
   * Note that user can be either a single username string or an array of usernames.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid user.
   */
  private defineNewUser({ user, feedType, timestamp = moment().toDate(), retired = false }: IFeedDefine) {
    // First, see if we've already defined any users within the past day.
    const recentFeedID = this.checkPastDayFeed(this.NEW_USER);
    // If there's a recentFeed, then update it instead with this user's info.
    if (recentFeedID) {
      this.updateNewUser(user, recentFeedID);
      return recentFeedID;
    }
    // Otherwise create and return a new feed instance.
    // First, create an array of users if we weren't passed one initially.
    const users = (_.isArray(user)) ? user : [user];
    const userIDs = Users.getIDs(users);
    let picture = Users.getProfile(userIDs[0]).picture;
    let description = 'A new user has joined RadGrad';
    if (userIDs.length > 1) {
      description = 'Multiple users have joined RadGrad';
      picture = defaultProfilePicture;
    }
    const feedID = this.collection.insert({ userIDs, description, feedType, timestamp, picture, retired });
    return feedID;
  }

  /**
   * Defines a new Feed (new course).
   * @example
   * Feeds._defineNewCourse({ feedType: Feeds.NEW_COURSE,
   *                        course: 'ics_100'
   *                        timestamp: '12345465465', });
   * @param { Object } description Object with keys course, feedType, and timestamp.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid course.
   */
  private defineNewCourse({ course, feedType, timestamp = moment().toDate(), retired = false }: IFeedDefine) {
    const courseID = Courses.getID(course);
    const c = Courses.findDoc(courseID);
    const description = `[${c.name}](/explorer/courses/${Slugs.getNameFromID(c.slugID)}) has been added to Courses`;
    const picture = '/images/radgrad_logo.png';
    const feedID = this.collection.insert({
      userIDs: [],
      courseID,
      description,
      feedType,
      picture,
      timestamp,
      retired,
    });
    return feedID;
  }

  /**
   * Defines a new Feed (new opportunity).
   * @example
   * Feeds._defineNewOpportunity({ feedType: Feeds.NEW_OPPORTUNITY,
   *                             opportunity: 'att-hackathon'
   *                             timestamp: '12345465465', });
   * @param { Object } description Object with keys opportunity, feedType, and timestamp.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid opportunity.
   */
  private defineNewOpportunity({ opportunity, feedType, timestamp = moment().toDate(), retired = false }: IFeedDefine) {
    const opportunityID = Opportunities.getID(opportunity);
    const o = Opportunities.findDoc(opportunityID);
    const description = `[${o.name}](/explorer/opportunities/${Slugs.getNameFromID(o.slugID)}) has been added to Opportunities`;
    const picture = '/images/radgrad_logo.png';
    const feedID = this.collection.insert({
      userIDs: [],
      opportunityID,
      description,
      timestamp,
      picture,
      feedType,
      retired,
    });
    return feedID;
  }

  /**
   * Adds the verified opportunity to the Feed.
   * If there is no verified-opportunity feed within the past day, then a new Feed instance is created and its docID
   * is returned.
   * If there is a verified-opportunity feed within the past day, then this info is added to it and its docID is
   * returned.
   * @example
   * Feeds.defineNewVerifiedOpportunity({ feedType: Feeds.VERIFIED_OPPORTUNITY,
   *                                      user: 'abi@hawaii.edu',
   *                                      opportunity: 'att-hackathon'
   *                                      academicTerm: 'Spring-2013'
   *                                      timestamp: '12345465465', });
   * @param { Object } description Object with keys user, opportunity, academicTerm, feedType, and timestamp.
   * Note that user can be either a single username string or an array of usernames.
   * @returns The docID associated with this info.
   * @throws {Meteor.Error} If not a valid opportunity, academicTerm, or user.
   */
  private defineNewVerifiedOpportunity({ user, opportunity, academicTerm, feedType, timestamp = moment().toDate(), retired = false }: IFeedDefine) {
    // First, see if we've already defined any verified-opportunities for this opportunity within the past day.
    const recentFeedID = this.checkPastDayFeed(this.VERIFIED_OPPORTUNITY, opportunity);
    // If there's a recentFeed, then update it instead with this user's info and return.
    if (recentFeedID) {
      this.updateVerifiedOpportunity(user, recentFeedID);
      return recentFeedID;
    }
    // Otherwise, define a new feed instance.
    const users = (_.isArray(user)) ? user : [user];
    const userIDs = Users.getIDs(users);
    const termID = AcademicTerms.getID(academicTerm);
    const opportunityID = Opportunities.getID(opportunity);
    const o = Opportunities.findDoc(opportunityID);
    const description = `[${o.name}](/explorer/opportunities/${Slugs.getNameFromID(o.slugID)}) (${AcademicTerms.toString(termID, false)})
    ${(userIDs.length > 1) ? ' was verified for multiple RadGrad students' : ' was verified for a RadGrad student'}`;
    const picture = '/images/radgrad_logo.png';
    const feedID = this.collection.insert({
      userIDs,
      opportunityID,
      termID,
      description,
      timestamp,
      picture,
      feedType,
      retired,
    });
    return feedID;
  }

  /**
   * Defines a new Feed (new course review).
   * @example
   * Feeds.defineNewCourseReview({ feedType: Feeds.NEW_COURSE_REVIEW,
   *                              user: 'abi@hawaii.edu',
   *                              course: 'ics_111'
   *                              timestamp: '12345465465', });
   * @param { Object } description Object with keys user, course, feedType, and timestamp.
   * User can either be the string username or an array containing a single username.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid course or user.
   */
  private defineNewCourseReview({ user, course, feedType, timestamp = moment().toDate(), retired = false }: IFeedDefine) {
    const userID = Users.getID((_.isArray(user)) ? user[0] : user);
    const courseID = Courses.getID(course);
    const c = Courses.findDoc(courseID);
    const description = `A new course review has been added for [${c.name}](/explorer/courses/${Slugs.getNameFromID(c.slugID)})`;
    const picture = '/images/radgrad_logo.png';
    const feedID = this.collection.insert({
      userIDs: [userID],
      courseID,
      description,
      timestamp,
      picture,
      feedType,
      retired,
    });
    return feedID;
  }

  /**
   * Defines a new Feed (new opportunity review).
   * @example
   * Feeds._defineNewOpportunityReview({ feedType: Feeds.NEW_OPPORTUNITY_REVIEW,
   *                                   user: 'abi@hawaii.edu',
   *                                   opportunity: 'att-hackathon'
   *                                   timestamp: '12345465465', });
   * @param { Object } description Object with keys user, opportunity, feedType, and timestamp.
   * User can either be the string username or an array containing a single username.
   * @returns The newly created docID.
   * @throws {Meteor.Error} If not a valid opportunity or user.
   */
  private defineNewOpportunityReview({ user, opportunity, feedType, timestamp = moment().toDate(), retired = false }: IFeedDefine) {
    const userID = Users.getID((_.isArray(user)) ? user[0] : user);
    const opportunityID = Opportunities.getID(opportunity);
    const o = Opportunities.findDoc(opportunityID);
    const description = `A new opportunity review has been added for [${o.name}](/explorer/opportunities/${Slugs.getNameFromID(o.slugID)})`;
    const picture = '/images/radgrad_logo.png';
    const feedID = this.collection.insert({
      userIDs: [userID], opportunityID, description, timestamp, picture,
      feedType, retired,
    });
    return feedID;
  }

  /**
   * Defines a new Feed (new level).
   * @example
   * Feeds._defineNewLevel({ feedType: Feeds.NEW_LEVEL,
   *                         user: 'abi@hawaii.edu'
   *                         level: 6,
   *                      });
   * @param user the username.
   * @param level the new level.
   * @param feedType Feeds.NEW_LEVEL.
   * @param timestamp The time of the Feed.
   * @private
   */
  private defineNewLevel({ user, level, feedType, timestamp = moment().toDate(), retired = false }: IFeedDefine) {
    // First, see if we've already defined any users within the past day.
    const recentFeedID = this.checkPastDayLevelFeed(level, timestamp.toString());
    // If there's a recentFeed, then update it instead with this user's info.
    if (recentFeedID) {
      this.updateNewLevel(user, recentFeedID, level);
      return recentFeedID;
    }

    const userID = Users.getID((_.isArray(user)) ? user[0] : user);
    const description = `A RadGrad student has achieved Level ${level}`;
    let picture = Users.getProfile(userID).picture;
    if (!picture) {
      picture = defaultProfilePicture;
    }
    const feedID = this.collection.insert({
      userIDs: [userID], description, timestamp, picture,
      feedType, retired,
    });
    return feedID;
  }

  /**
   * Returns a feedID with the same feedType (and opportunity, if feedType is Feeds.VERIFIED_OPPORTUNITY)
   * if it exists within the past 24 hours.
   * Returns false if no such feedID is found.
   * Opportunity is required only if feedType is Feeds.VERIFIED_OPPORTUNITY
   * @returns {Object} The feedID if found.
   * @returns {boolean} False if feedID is not found.
   */
  public checkPastDayFeed(feedType: string, opportunity?: string, timestamp: any = moment().toDate()) {
    let ret = '';
    const verifiedOpportunity = this.VERIFIED_OPPORTUNITY;
    const existingFeed = _.find(this.collection.find().fetch(), (feed) => {
      if (withinPastDay(feed, timestamp)) {
        if (feed.feedType === feedType) {
          if (feedType === verifiedOpportunity) {
            const opportunityID = Opportunities.getID(opportunity);
            if (opportunityID === feed.opportunityID) {
              return true;
            }
          } else {
            return true;
          }
        }
      }
      return false;
    });
    if (existingFeed) {
      ret = existingFeed._id;
    }
    return ret;
  }

  public checkPastDayLevelFeed(level, timestamp = moment().format()) {
    let ret = '';
    const newLevel = this.NEW_LEVEL;
    const existingFeed = _.find(this.collection.find().fetch(), (feed) => {
      if (withinPastDay(feed, timestamp)) {
        if (feed.feedType === newLevel) {
          // check the level
          if (feed.description.includes(`${level}.`)) {
            return true;
          }
        }
      }
      return false;
    });
    if (existingFeed) {
      ret = existingFeed._id;
    }
    return ret;
  }

  /**
   * Updates the existingFeedID with the new userID information
   * @param userID the new userID, existingFeedID the existing feed of the same type within the past 24 hours
   * @throws {Meteor.Error} If username is not a username, or if existingFeedID is not a feedID.
   */
  private updateNewUser(username, existingFeedID) {
    const userID = Users.getID(username);
    this.assertDefined(existingFeedID);
    const existingFeed = this.findDoc(existingFeedID);
    const userIDs = existingFeed.userIDs;
    userIDs.push(userID);
    const description = 'Multiple users have joined RadGrad';
    const picture = defaultProfilePicture;
    this.collection.update(existingFeedID, { $set: { userIDs, description, picture } });
  }

  private updateNewLevel(user, existingFeedID, level) {
    const userID = Users.getID((_.isArray(user)) ? user[0] : user);
    this.assertDefined(existingFeedID);
    const existingFeed = this.findDoc(existingFeedID);
    const userIDs = existingFeed.userIDs;
    userIDs.push(userID);
    const description = `Multiple RadGrad students have achieved level ${level}`;
    const picture = defaultProfilePicture;
    this.collection.update(existingFeedID, { $set: { userIDs, description, picture } });
  }

  /**
   * Updates the existingFeedID with the new userID information
   * @param userID the new userID, existingFeedID the existing feed of the same type within the past 24 hours
   * @throws {Meteor.Error} If username is not a username, or if existingFeedID is not a feedID.
   */
  private updateVerifiedOpportunity(username: string, existingFeedID: string) {
    const userID = Users.getID(username);
    this.assertDefined(existingFeedID);
    const existingFeed = this.findDoc(existingFeedID);
    const userIDs = existingFeed.userIDs;
    userIDs.push(userID);
    const o = Opportunities.findDoc(existingFeed.opportunityID);
    const description = `[${o.name}](/explorer/opportunities/${Slugs.getNameFromID(o.slugID)}) (${AcademicTerms.toString(existingFeed.termID, false)}) has been verified for multiple RadGrad students`;
    this.collection.update(existingFeedID, { $set: { userIDs, description } });
  }

  /**
   * Removes all Feed documents referring to user.
   * @param user The user, either the ID or the username.
   * @throws { Meteor.Error } If user is not an ID or username.
   */
  public removeUser(user: string) {
    const userID = Users.getID(user);
    // There could be some collateral damage here, but whatever.
    this.collection.remove({ userIDs: { $in: [userID] } });
  }

  /**
   * Asserts that userId is logged in as an Admin, Faculty, Student, or Advisor.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not in the allowed roles.
   */
  public assertValidRoleForMethod(userId: string) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.ADVISOR, ROLE.STUDENT, ROLE.FACULTY]);
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks slugID, userID, opportunityID, and courseID.
   * Note that userID, opportunityID, and courseID are all optional.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity() {
    const problems = [];
    this.find().forEach((doc) => {
      _.forEach(doc.userIDs, (userID) => {
        if (!Users.isDefined(userID)) {
          problems.push(`Bad userID: ${userID}`);
        }
      });
      if (doc.opportunityID && !Opportunities.isDefined(doc.opportunityID)) {
        problems.push(`Bad opportunityID: ${doc.opportunityID}`);
      }
      if (doc.courseID && !Courses.isDefined(doc.courseID)) {
        problems.push(`Bad courseID: ${doc.courseID}`);
      }
      if (doc.termID && !AcademicTerms.isDefined(doc.termID)) {
        problems.push(`Bad termID: ${doc.termID}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the Feed docID in a format acceptable to define().
   * @param docID The docID of a Feed.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): IFeedDefine {
    const doc = this.findDoc(docID);
    let user;
    if (doc.userIDs) {
      user = _.map(doc.userIDs, (userID) => Users.getProfile(userID).username);
    }
    let opportunity;
    if (doc.opportunityID) {
      opportunity = Opportunities.findSlugByID(doc.opportunityID);
    }
    let course;
    if (doc.courseID) {
      course = Courses.findSlugByID(doc.courseID);
    }
    let academicTerm;
    if (doc.termID) {
      academicTerm = AcademicTerms.findSlugByID(doc.termID);
    }
    const feedType = doc.feedType;
    const timestamp = doc.timestamp;
    const retired = doc.retired;
    return { user, opportunity, course, academicTerm, feedType, timestamp, retired };
  }

  /**
   * Publish a maximum of the last 25 feeds to users
   */
  public publish() {
    if (Meteor.isServer) {
      Meteor.publish(this.collectionName, () => this.collection.find({}, { sort: { timestamp: -1 }, limit: 25 }));
    }
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/feed
 */
export const Feeds = new FeedCollection();
