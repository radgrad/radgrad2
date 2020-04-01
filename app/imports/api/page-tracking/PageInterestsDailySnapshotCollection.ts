import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import BaseCollection from '../base/BaseCollection';
import { IPageInterestsDailySnapshot, IPageInterestsDailySnapshotDefine } from '../../typings/radgrad';
import { ROLE } from '../role/Role';
import { Slugs } from '../slug/SlugCollection';

/**
 * Represents a snapshot of the aggregated student interest views for the different categories for a particular day
 *  * The different topic categories that are tracked an counted towards student interest views are Career Goal, Course, Interest, and Opportunity
 * See PageInteressCollection to see the definition of a page interest view.
 * This collection is populated automatically on the server-side.
 * @extends api/base.BaseCollection
 * @memberOf @api/page-tracking
 */
class PageInterestsDailySnapshotCollection extends BaseCollection {

  /**
   * Creates the PageInterestsDailySnapshot collection.
   */
  constructor() {
    super('PageInterestsDailySnapshot', new SimpleSchema({
      careerGoals: Array,
      'careerGoals.$': Object,
      'careerGoals.$.name': String,
      'careerGoals.$.views': { type: SimpleSchema.Integer, min: 0 },
      courses: Array,
      'courses.$': Object,
      'courses.$.name': String,
      'courses.$.views': { type: SimpleSchema.Integer, min: 0 },
      interests: Array,
      'interests.$': Object,
      'interests.$.name': String,
      'interests.$.views': { type: SimpleSchema.Integer, min: 0 },
      opportunities: Array,
      'opportunities.$': Object,
      'opportunities.$.name': String,
      'opportunities.$.views': { type: SimpleSchema.Integer, min: 0 },
      timestamp: Date,
    }));
  }

  /**
   * Defines a snapshot of the aggregated student interest views for the different categories for the particular timestamp.
   * Only Admins should be able to define a document for this collection.
   * Never call this method directly, use the pageInterestsDefineMethod.
   * @param careerGoals
   * @param courses
   * @param interests
   * @param opportunities
   * @param timestamp
   */
  public define({ careerGoals, courses, interests, opportunities, timestamp = moment().toDate() }: IPageInterestsDailySnapshotDefine): string {
    return this.collection.insert({ careerGoals, courses, interests, opportunities, timestamp });
  }

  /**
   * Asserts that the userID belongs to an admin role when running the find and removeUser method within this class.
   * Only Admins should be able to query a DEFINE, REMOVE, and UPDATE from this collection.
   * @param userId The userId of the logged in user.
   */
  public assertAdminRoleForMethod(userId: string) {
    this.assertRole(userId, [ROLE.ADMIN]);
  }

  /**
   * Asserts that the userID belongs to a valid role when running the define method within this class.
   * Admins, Students, Advisor, Mentor, and Faculty can query a FIND from this collection.
   * Prefer to call this method via pageInterestsFindMethod.
   * @param userId The userId of the logged in user.
   */
  public assertValidRoleForMethod(userId: string) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.STUDENT, ROLE.ADVISOR, ROLE.MENTOR, ROLE.FACULTY]);
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks each object in the careerGoals, courses, interests, and opportunities arrays.
   * For each object, check the name if it is a valid slug and validate the views to be a positive integer.
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity(): string[] {
    const problems = [];
    this.find({}, {}).forEach((doc: IPageInterestsDailySnapshot) => {
      doc.careerGoals.forEach((careerGoal) => {
        if (!Slugs.isDefined(careerGoal.name)) {
          problems.push(`Bad careerGoal slug: ${careerGoal.name}`);
        }
        if (careerGoal.views < 0) {
          problems.push(`Bad careerGoal views: ${careerGoal.views}`);
        }
      });
      doc.courses.forEach((course) => {
        if (!Slugs.isDefined(course.name)) {
          problems.push(`Bad careerGoal slug: ${course.name}`);
        }
        if (course.views < 0) {
          problems.push(`Bad careerGoal views: ${course.views}`);
        }
      });
      doc.interests.forEach((interest) => {
        if (!Slugs.isDefined(interest.name)) {
          problems.push(`Bad careerGoal slug: ${interest.name}`);
        }
        if (interest.views < 0) {
          problems.push(`Bad careerGoal views: ${interest.views}`);
        }
      });
      doc.opportunities.forEach((opportunity) => {
        if (!Slugs.isDefined(opportunity.name)) {
          problems.push(`Bad careerGoal slug: ${opportunity.name}`);
        }
        if (opportunity.views < 0) {
          problems.push(`Bad careerGoal views: ${opportunity.views}`);
        }
      });
    });
    return problems;
  }

  /**
   * Returns an object representing the PageInterestsDailySnapshot docID in a format acceptable to define().
   * @param docID The docID of a PageInterestsDailySnapshot
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): IPageInterestsDailySnapshotDefine {
    const doc: IPageInterestsDailySnapshot = this.findDoc(docID);
    const careerGoals = doc.careerGoals;
    const courses = doc.courses;
    const interests = doc.interests;
    const opportunities = doc.opportunities;
    const timestamp = doc.timestamp;
    return { careerGoals, courses, interests, opportunities, timestamp };
  }
}

export const PageInterestsDailySnapshots = new PageInterestsDailySnapshotCollection();
