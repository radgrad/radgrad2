import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import BaseCollection from '../base/BaseCollection';
import { IPageInterestsDailySnapshot, IPageInterestsDailySnapshotDefine } from '../../typings/radgrad';
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
      retired: { type: Boolean, optional: true },
    }));
  }

  /**
   * Gets the correct timestamp date that the daily snapshot represents
   * The cron job that autopopulates this collection runs at 00:00:00 (morning of next day)
   * Since a daily snapshot represents the page interest views for the day BEFORE, we need to subtract one day from
   * .toDate() when the define() method is called.
   * i.e.,
   *  A cron job runs at June 18,2020 00:00:00 AM
   *  Therefore, the timestamp for the daily snapshot that it creates should represent the page interest views that
   *  were defined between June 17,2020 00:00:00 AM and June 17,2020 23:59:59 PM
   *  Thus, the timestamp of the daily snapshot created on June 18,2020 00:00:00 AM should be June 17, 2020 23:59:59 PM
   * @returns {Date}
   */
  private getDateOffset = moment().subtract(1, 'day').endOf('day').toDate();

  /**
   * Defines a snapshot of the aggregated student interest views for the different categories for the particular timestamp.
   * This should never be called manually as it is handled by a cron job.
   * @param careerGoals Array of objects that describe the name and views for all career goals
   * @param courses Array of objects that describe the name and views for all courses
   * @param interests Array of objects that describe the name and views for all interests
   * @param opportunities Array of objects that describe the name and views for all opportunities
   * @param timestamp the timestamp that represents the page interests it aggregated
   *          by default, this is the day before .toDate(). This is because the cron job that autopopulates
   *          this collection runs on 00:00:00 time (the day after), so we need to subtract one day
   * @param retired boolean optional defaults to false.
   * @returns {String} the id of the document created
   */
  public define({ careerGoals, courses, interests, opportunities, timestamp = this.getDateOffset, retired = false }: IPageInterestsDailySnapshotDefine): string {
    // Duplicates are not allowed
    // 1) Documents with the same values for all its fields
    let doc: IPageInterestsDailySnapshot;
    doc = this.collection.findOne({ careerGoals, courses, interests, opportunities, timestamp, retired });
    if (doc) {
      return doc._id;
    }
    // 2) Documents with the same values for all its fields within the same day that it represents
    doc = this.collection.findOne({
      careerGoals,
      courses,
      interests,
      opportunities,
      timestamp: {
        $gte: moment().subtract(1, 'day').startOf('day').toDate(),
        $lte: moment().subtract(1, 'day').endOf('day').toDate(),
      },
      retired,
    });
    if (doc) {
      return doc._id;
    }
    return this.collection.insert({ careerGoals, courses, interests, opportunities, timestamp, retired });
  }

  /**
   * Remove the Page Interests Daily Snapshot
   * @param docID The docID of the Page Interests Daily Snapshot
   */
  public removeIt(docID: string): boolean {
    this.assertDefined(docID);
    return super.removeIt(docID);
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
          problems.push(`Bad course slug: ${course.name}`);
        }
        if (course.views < 0) {
          problems.push(`Bad course views: ${course.views}`);
        }
      });
      doc.interests.forEach((interest) => {
        if (!Slugs.isDefined(interest.name)) {
          problems.push(`Bad interest slug: ${interest.name}`);
        }
        if (interest.views < 0) {
          problems.push(`Bad interest views: ${interest.views}`);
        }
      });
      doc.opportunities.forEach((opportunity) => {
        if (!Slugs.isDefined(opportunity.name)) {
          problems.push(`Bad opportunity slug: ${opportunity.name}`);
        }
        if (opportunity.views < 0) {
          problems.push(`Bad opportunity views: ${opportunity.views}`);
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
    const retired = doc.retired;
    return { careerGoals, courses, interests, opportunities, timestamp, retired };
  }
}

export const PageInterestsDailySnapshots = new PageInterestsDailySnapshotCollection();
