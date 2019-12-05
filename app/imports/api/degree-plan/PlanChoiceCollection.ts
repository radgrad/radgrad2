import SimpleSchema from 'simpl-schema';
import * as _ from 'lodash';
import BaseCollection from '../base/BaseCollection';
import { buildSimpleName } from './PlanChoiceUtilities';
import { IPlanChoiceDefine, IPlanChoiceUpdate } from '../../typings/radgrad'; // eslint-disable-line no-unused-vars
import { Slugs } from '../slug/SlugCollection';
import { Courses } from '../course/CourseCollection';

/**
 * Represents a choice in an academic plan.
 * @extends api/base.BaseCollection
 * @memberOf api/degree-plan
 */
export class PlanChoiceCollection extends BaseCollection {

  /**
   * Creates a plan choice.
   */
  constructor() {
    super('PlanChoice', new SimpleSchema({
      choice: { type: String },
      retired: { type: Boolean, optional: true },
    }));
    this.defineSchema = new SimpleSchema({
      choice: String,
      retired: { type: Boolean, optional: true },
    });
    this.updateSchema = new SimpleSchema({
      choice: { type: String, optional: true },
      retired: { type: Boolean, optional: true },
    });
  }

  /**
   * Defines a PlanChoice.
   * @example
   * PlanChoices.define({ 'ics_312,ics_331-1' });
   * Defines the choice of ICS 312 or ICS 331.
   * @param choice
   * @returns {*}
   */
  public define({ choice, retired = false }: IPlanChoiceDefine) {
    const doc = this.collection.findOne(choice);
    if (doc) {
      return doc._id;
    }
    return this.collection.insert({ choice, retired });
  }

  /**
   * Updates this PlanChoice.
   * @param docID The docID associated with this plan choice.
   * @param choice the updated choice.
   */
  public update(docID: string, { choice, retired }: IPlanChoiceUpdate) {
    this.assertDefined(docID);
    const updateData: IPlanChoiceUpdate = {};
    if (choice) {
      updateData.choice = choice;
    }
    if (_.isBoolean(retired)) {
      updateData.retired = retired;
    }
    this.collection.update(docID, { $set: updateData });
  }

  /**
   * Creates a human readable string representation of the choice.
   * @param planChoiceSlug
   * @returns {string}
   */
  public static toStringFromSlug(planChoiceSlug: string) {
    let ret = '';
    let slug;
    const countIndex = planChoiceSlug.indexOf('-');
    if (countIndex === -1) {
      slug = planChoiceSlug;
    } else {
      slug = planChoiceSlug.substring(0, countIndex);
    }
    while (slug.length > 0) {
      let temp;
      let index;
      if (slug.startsWith('(')) {
        index = slug.indexOf(')');
        temp = slug.substring(1, index);
        ret = `${ret}(${buildSimpleName(temp)}) or `;
        if (index < slug.length - 2) {
          slug = slug.substring(index + 2); // skip over the ,
        } else {
          slug = '';
        }
      } else
        if (slug.indexOf(',') !== -1) {
          index = slug.indexOf(',');
          temp = slug.substring(0, index);
          slug = slug.substring(index + 1);
          ret = `${ret}${buildSimpleName(temp)} or `;
        } else {
          temp = slug;
          slug = '';
          ret = `${ret}${buildSimpleName(temp)} or `;
        }
    }
    return ret.substring(0, ret.length - 4);
  }

  /**
   * Returns an empty array (no integrity checking done on this collection).
   * This method will ensure that there is a single choice for each of the non retired courses.
   * @returns {Array} An empty array.
   */
  public checkIntegrity() {
    const courses = Courses.findNonRetired();
    const courseSlugs = _.map(courses, (c) => Slugs.getNameFromID(c.slugID));
    _.forEach(courseSlugs, (choice) => {
      if (choice !== 'other') {
        try {
          this.findDoc({ choice });
        } catch (e) {
          this.define({ choice });
          // console.log('defining ', choice);
        }
      }
    });
    const problems = [];
    return problems;
  }

  /**
   * Returns an object representing the PlanChoice docID in a format acceptable to define().
   * @param docID The docID of a PlanChoice.
   * @returns { Object } An object representing the definition of docID.
   */
  public dumpOne(docID: string): IPlanChoiceDefine {
    const doc = this.findDoc(docID);
    const choice = doc.choice;
    const retired = doc.retired;
    return { choice, retired };
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/degree-plan
 */
export const PlanChoices = new PlanChoiceCollection();
