import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import BaseCollection from '../base/BaseCollection';
import { buildSimpleName, complexChoiceToArray } from './PlanChoiceUtilities';
import { IPlanChoiceDefine, IPlanChoiceUpdate } from '../../typings/radgrad';
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
      choice: String, // this is the choice such as ics111 or ics_313,ics_361
      label: String, // the label to present to the user.
      courseSlugs: Array, // an array of course slugs that satisfy this choice.
      'courseSlugs.$': String,
      retired: { type: Boolean, optional: true },
    }));
    this.defineSchema = new SimpleSchema({
      choice: String, // this is the choice such as ics111 or ics_313,ics_361
      label: String, // the label to present to the user.
      courseSlugs: Array, // an array of course slugs that satisfy this choice.
      'courseSlugs.$': String,
      retired: { type: Boolean, optional: true },
    });
    this.updateSchema = new SimpleSchema({
      choice: { type: String, optional: true }, // this is the choice such as ics111 or ics_313,ics_361
      label: { type: String, optional: true }, // the label to present to the user.
      courseSlugs: { type: Array, optional: true }, // an array of course slugs that satisfy this choice.
      'courseSlugs.$': String,
      retired: { type: Boolean, optional: true },
    });
  }

  /**
   * Defines a PlanChoice.
   * @example
   * PlanChoices.define({ 'ics_312,ics_331-1' });
   * Defines the choice of ICS 312 or ICS 331.
   * @param choice
   * @param {boolean} retired, (optional) defaults to false.
   * @returns {*}
   */
  public define({ choice, label, courseSlugs, retired = false }: IPlanChoiceDefine) {
    const doc = this.collection.findOne(choice);
    if (doc) {
      return doc._id;
    }
    return this.collection.insert({ choice, label, courseSlugs, retired });
  }

  /**
   * Updates this PlanChoice.
   * @param docID The docID associated with this plan choice.
   * @param choice the updated choice.
   */
  public update(docID: string, { choice, label, courseSlugs, retired }: IPlanChoiceUpdate) {
    this.assertDefined(docID);
    const updateData: IPlanChoiceUpdate = {};
    if (choice) {
      updateData.choice = choice;
    }
    if (label) {
      updateData.label = label;
    }
    if (courseSlugs) {
      updateData.courseSlugs = courseSlugs;
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
    const problems = [];
    this.find().forEach((doc) => {
      // check to see if all courses are defined.
      doc.courseSlugs.forEach((slug) => {
        if (!Courses.isDefined(slug)) {
          problems.push(`Course is not defined ${slug} in choice ${doc.name}:${doc.loabel}`);
        }
      });
      // check to see if choice matches course slugs
      const choiceArray = complexChoiceToArray(doc.choice);
      if (choiceArray.length !== doc.courseSlugs.length) {
        problems.push(`Choice ${doc.choice}: ${choiceArray.join(', ')} doesn't match courseSlugs ${doc.courseSlugs.join(', ')}`);
      }
      _.forEach(choiceArray, (choice) => {
        if (!_.includes(doc.courseSlugs, choice)) {
          problems.push(`Course ${choice} is not in the courseSlugs ${doc.courseSlugs}`);
        }
      });
    });
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
    const label = doc.label;
    const courseSlugs = doc.courseSlugs;
    const retired = doc.retired;
    return { choice, label, courseSlugs, retired };
  }

}

/**
 * Provides the singleton instance of this class to all other entities.
 * @memberOf api/degree-plan
 */
export const PlanChoices = new PlanChoiceCollection();
