import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import BaseCollection from '../base/BaseCollection';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { PageInterestsCategoryTypes } from './PageInterestsCategoryTypes';
import { Slugs } from '../slug/SlugCollection';
import { IPageInterestsTermSnapshot, IPageInterestsTermSnapshotDefine } from '../../typings/radgrad';

/**
 * Represents a snapshot of the aggregated student interest views for an academic term
 * The different topic categories that are tracked an counted towards student interest views are Career Goal, Course, Interest, and Opportunity
 * See PageInteressCollection to see the definition of a page interest view.
 * @extends api/base.BaseCollection
 * @memberOf @api/page-tracking
 */
class PageInterestsTermSnapshotCollection extends BaseCollection {

  // TODO: See https://github.com/radgrad/radgrad2/issues/138#issuecomment-606245409
  /**
   * Creates the TermSnapshotPageInterests collection.
   */
  constructor() {
    // TODO: Rework the structure/schema of the TermSnapshot to use less documents. See DailySnapshot structure
    super('PageInterestsTermSnapshot', new SimpleSchema({
      termID: SimpleSchema.RegEx.Id,
      category: String,
      name: String,
      views: { type: SimpleSchema.Integer, min: 0 },
      timestamp: Date,
    }));
  }

  /**
   * Defines a snapshot of a page's student interest views
   * @param termID The ID of the academic term that this snapshot represents
   * @param category The topic category that this snapshot represents
   * @param name The name that the page represents
   * @param views The number of student interest views for that name
   * @param timestamp Timestamp of when this snapshot was recorded
   */
  public define({ termID, category, name, views = 0, timestamp = moment().toDate() }: IPageInterestsTermSnapshotDefine): string {
    return this.collection.insert({ termID, category, name, views, timestamp });
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks termID, category, name, and views
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  public checkIntegrity(): string[] {
    const problems = [];
    this.find({}, {}).forEach((doc: IPageInterestsTermSnapshot) => {
      if (!AcademicTerms.isDefined(doc.termID)) {
        problems.push(`Bad termID: ${doc.termID}`);
      }
      const categories = Object.values(PageInterestsCategoryTypes);
      if (categories.indexOf(doc.category) < 0) {
        problems.push(`Bad category: ${doc.category}`);
      }
      if (!Slugs.isDefined(doc.name)) {
        problems.push(`Bad slug: ${doc.name}`);
      }
      if (doc.views < 0) {
        problems.push(`Bad views: ${doc.views}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the PageInterestsTermSnapshot docID in a format acceptable to define().
   * @param docID The docID of a PageInterestsTermSnapshot
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): IPageInterestsTermSnapshotDefine {
    const doc: IPageInterestsTermSnapshot = this.findDoc(docID);
    const termID = doc.termID;
    const category = doc.category;
    const name = doc.name;
    const views = doc.views;
    const timestamp = doc.timestamp;
    return { termID, category, name, views, timestamp };
  }
}

export const PageInterestsTermSnapshots = new PageInterestsTermSnapshotCollection();
